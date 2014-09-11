var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname+'/index.html');
});

// listen on connection event for incoming sockets
io.on('connection', function(socket){
  socket.on('join', function(username){
    // set username associated with a client
    socket.username = username;
  });
  // on incoming 'chat message' event, send message
  socket.on('chat message', function(msg){
    // print username of client with broadcasting message
    io.emit('chat message', socket.username + ': ' + msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});