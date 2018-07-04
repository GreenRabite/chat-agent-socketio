// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

let numUsers = 0;

// Routing
app.use(express.static(path.join(__dirname, 'public')));

// Chatroom

let agentArr = [];
let clientObj = {};

io.on('connection', (socket) => {
  var addedUser = false;
  console.log("Socket ID is:",socket.id);

  // Emits a user count to the person establish a connection
  io.emit('Receive User Count', {
    agent: agentArr.length,
    client: Object.keys(clientObj)? Object.keys(clientObj).length : 0
  });

  // Login screen, when a user chooses someone
  socket.on('User Chosen', (data) => {
    if (data.role === 'agent'){ agentArr.push(data.socketId);}
    if (data.role === 'client'){ clientObj[data.socketId]=data.username;}
    console.log(agentArr);
    console.log(clientObj);
  });

  // When client login, join their special room
  socket.on('ClientRoom', () => {
    console.log(socket.id);
    console.log('Join Room ID:',socket.id);
    socket.join(`${socket.id}`);
    io.emit('ReceiveClients', clientObj);
    io.emit('NewClients',{});
  });

  // Agents used to join room with clients
  socket.on('JoinClients', () => {
    console.log("joinclients",clientObj);
    if (Object.keys(clientObj) !== undefined) {
      Object.keys(clientObj).forEach(id => {
        console.log("Agent joined: Room ID:",id);
        socket.join(id);
      });
      io.emit('ReceiveClients', clientObj);
    }
  });

  socket.on('SEND_MESSAGE', function(data){
      console.log("receive");
      console.log(socket.id);
      console.log("Room Id is:",data.room);
      let roomId = data.room;
      io.sockets.in(roomId).emit('RECEIVE_MESSAGE', data);
    });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', (data) => {
    console.log("Socket closed:", socket.id);
    delete clientObj[socket.id];
    if(agentArr.includes(socket.id)){agentArr.pop();}
    console.log(agentArr);
    console.log(clientObj);
    io.emit('ReceiveClients', clientObj);
  });
});
