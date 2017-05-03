import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import favicon from 'serve-favicon';
import path from 'path';
import morgan from 'morgan';
import mysql from 'mysql';
import gameRoutes from './routes/game';
import dotenv from 'dotenv';
import http from 'http';
import uuid from 'uuid/v4';
import randomWord from 'random-word';
import btoa from 'btoa';
import atob from 'atob';

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
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

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

app.use(express.static(__dirname + './../public'));
app.use('/game/:hash', express.static(__dirname + './../public'));
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));


console.log("---------REGISTERING GAME ROUTES--------");
gameRoutes(app,mysql,path);


io.on('connect', handleSockets); //all of the handshakes

let activeUsers = {};

function updateActiveUsers(user){
  if(typeof user.name === 'undefined' || user.name.length === 0){
    delete activeUsers[user.UUID];
  } else {
    activeUsers[user.UUID] = {
      name: user.name,
      private: user.private
    }
  }
  console.log("\n\n\n\n--------------ACTIVE USERS--------------");
  console.log(activeUsers);
  console.log("--------------ACTIVE USERS--------------\n\n\n\n");
}

let privateRooms = {}
function handlePrivateRooms(roomName,usersArr){
  if(typeof usersArr === 'undefined' || usersArr.length === 0){
    delete privateRooms[roomName];
  } else {
    privateRooms[roomName] = usersArr;
  }
  console.log("\n\n\n\n-------------- PRIVATE ROOMS --------------");
  console.log(privateRooms);
  console.log("-------------- PRIVATE ROOMS --------------\n\n\n\n");
}



function handleSockets(socket){
  socket.on('add me', (user)=>{
    socket.UUID = user.UUID;
    socket.NAME = user.name;
    socket.ISPRIVATE = (typeof user.private === 'undefined') ? false : user.private;
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
        var newRoom = btoa(randomWord()).replace(/\=/g,'');

        io.sockets.in(roomsArr[0]).emit('from server',{
          leader:false,
          newRoom,
          roomsArr
        });
        io.sockets.in(roomsArr[1]).emit('from server',{
          leader:true,
          newRoom,
          roomsArr
        });

        updateActiveUsers({
          username:activeUsers[roomsArr[0]],
          UUID:roomsArr[0],
          private:true
        });

        updateActiveUsers({
          username:activeUsers[roomsArr[1]],
          UUID:roomsArr[1],
          private:true
        });

        handlePrivateRooms(newRoom,[roomsArr[0],roomsArr[1]]);

        io.sockets.emit('user left',roomsArr[0]); //tell everone that they left
        io.sockets.emit('user left',roomsArr[1]);
      } else {
        io.sockets.in(roomsArr[0]).emit('from server',{'message':"There are already two people in that room"});
      }
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>\n\n\n\n");
    }
  });


  socket.on('game', (request)=>{
    socket.join(request.roomName);
    //TODO ONLY ALLOW CHATROOM MESSAGES FROM THOSE IN CHATROOM
    //TODO complete the handshake
  })

  socket.on('disconnect', () =>{
    console.log("\n\n\n\n-------------- CLEAN ACTIVE USER POOL --------------");
    // console.log(socket.UUID);
    // console.log(socket.NAME);
    // console.log(socket.PRIVATE);
    updateActiveUsers({
      name: '',
      UUID: socket.UUID
    });
    socket.broadcast.emit('user left',socket.UUID);

  })

  // socket.on('private group initialize', (group)=>{
  //   // io.sockets.emit('user left',group);
  //
  //   updateActiveUsers({username:'',UUID:group.p1.uuid});
  //   updateActiveUsers({username:'',UUID:group.p2.uuid});
  // });



}

server.listen(process.env.APP_PORT, '0.0.0.0', () => { //broadcast to network
  console.log(`Listening to port ${process.env.APP_PORT}`);
});

// server.listen(process.env.APP_PORT, ()=>{
//   console.log(`server is listening on port ${new String(process.env.APP_PORT).toString()}`);
// });
