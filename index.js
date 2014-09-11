var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname+'/index.html');
});

// listen on connection event for incoming sockets
io.on('connection', function(socket){
  console.log('a user has connected');
  // on incoming 'chat message' event, console.log message
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});