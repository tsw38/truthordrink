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
function updateActiveUsers(user){
  if(!user.username.length){
    delete activeUsers[user.UUID];
    console.log('\n\ndeleting');
  } else {
    activeUsers[user.UUID] = user.username;
    console.log('\nadding');
  }
  console.log(user);
  console.log("\n\n");
}

io.on('connect', handleSockets);

function handleSockets(socket){
  socket.on('add me', (user)=>{
    socket.UUID = user.UUID;
    socket.username = user.username;
    updateActiveUsers(user);

    io.sockets.emit('user joined',{activeUsers:activeUsers});
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
