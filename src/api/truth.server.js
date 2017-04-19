import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import favicon from 'serve-favicon';
import path from 'path';
import mysql from 'mysql';
import dotenv from 'dotenv';
import http from 'http';
import getTruth from './routes/getTruth';
import uuid from 'uuid/v4';
import randomWord from 'random-word';

dotenv.config();

const app    = express();
const server = http.createServer(app);
const io     = require('socket.io')(server);
const con    = mysql.createConnection({
  host:process.env.DB_HOST,
  user:process.env.DB_USER,
  password:process.env.DB_PASS,
  database:process.env.DB_NAME
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());

app.use((req,res,next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if(typeof req.cookies.dHJ1dGhvcmRyaW5rdXNlcg === 'undefined'){
    let id = uuid();
    res.cookie('dHJ1dGhvcmRyaW5rdXNlcg', id, {maxAge: 24*60*60*1000, httpOnly: false,secure:false}); //maxage: 1 day

    let insertQuery = mysql.format('INSERT INTO users(UUID) VALUES(?)',[id]);
    con.query(insertQuery, (err,resp)=>{
      if(err){
        console.error(err);
      } else {
        console.log("Inserted New User");
      }
    });
  }
  next();
});

// getTruth(app,mysql);

app.use(express.static(__dirname + './../public'));
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));




let activeUsers = {};
let privateUsers = {};

function updateActiveUsers(user){
  if(!user.username.length){
    delete activeUsers[user.UUID];
  } else {
    activeUsers[user.UUID] = user.username;
  }
}
function updatePrivateUsers(user){
  if(!user.username.length){
    delete privateUsers[user.UUID];
  } else {
    privateUsers[user.UUID] = {
      username: user.username,
      privateRoom: user.newRoom
    };
  }
  console.log("--------------PRIVATE USERS--------------");
  console.log(privateUsers);
  console.log("--------------PRIVATE USERS--------------");
}

io.on('connect', handleSockets);

function handleSockets(socket){
  socket.on('add me', (user)=>{
    socket.UUID = user.UUID;
    socket.username = user.username;
    updateActiveUsers(user);

    io.sockets.emit('user joined',{activeUsers:activeUsers});
  });

  socket.on('room', (roomsArr)=>{
    if(roomsArr.length === 1){ //user is joining their own room
      socket.join(roomsArr[0]); //create a room for self
      io.sockets.in(roomsArr[0]).emit('from server', {message:'you have created your own room'});
    } else { //user is requesting to join another room
      let usersInRoom = io.sockets.adapter.rooms[roomsArr[1]];
      usersInRoom = (typeof usersInRoom !== 'undefined') ? usersInRoom.length : 0;
      if(usersInRoom === 1){
        console.log("----------------------THERE IS ONLY ! PERSON----------------");
        io.sockets.in(roomsArr[1]).emit('from server',{leader:true}); //before user joins, designate leader
        io.sockets.in(roomsArr[0]).emit('from server',{leader:false});
        socket.join(roomsArr[1]); //auto join requested room

        io.sockets.emit('user left',roomsArr[0]); //tell everone that they left
        io.sockets.emit('user left',roomsArr[1]);

        var newRoom = randomWord();
        io.sockets.in(roomsArr[1]).emit('from server',{newRoom,roomsArr});

        updatePrivateUsers({
          username:activeUsers[roomsArr[0]],
          UUID:roomsArr[0],
          newRoom
        });
        updatePrivateUsers({
          username:activeUsers[roomsArr[1]],
          UUID:roomsArr[1],
          newRoom
        });

      } else {
        io.sockets.in(roomsArr[0]).emit('from server',{'message':"There are already two people in that room"});
      }
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      //IF there is only one person in the room, accept the join, create secret room
      //delete "activeUsers in group from total list


    }

    // console.log('another room is requesting to be added');

  });


  socket.on('private group initialize', (group)=>{
    // io.sockets.emit('user left',group);

    updateActiveUsers({username:'',UUID:group.p1.uuid});
    updateActiveUsers({username:'',UUID:group.p2.uuid});
  });
  // io.sockets.emit('user joined', {activeUsers:activeUsers });

  socket.on('disconnect', () =>{
    socket.broadcast.emit('user left',socket.UUID);
    updateActiveUsers({
      username: '',
      UUID: socket.UUID
    });
  })
}

server.listen(process.env.APP_PORT, '0.0.0.0', () => {
  console.log(`Listening to port ${process.env.APP_PORT}`);
});

// server.listen(process.env.APP_PORT, ()=>{
//   console.log(`server is listening on port ${new String(process.env.APP_PORT).toString()}`);
// });
