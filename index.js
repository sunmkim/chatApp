var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require('redis');
var redisClient = redis.createClient();

var messages = [];

app.get('/', function(req,res){
  res.sendFile(__dirname+'/views/home.html');
});

app.get('/chat', function(req, res){
  res.sendFile(__dirname+'/views/index.html');
});

var storeMessage = function(name, data){
  var message = JSON.stringify({name: name, data: data});
  // only keep last 20 messages
  redisClient.lpush('messages', message, function(err, res){
    redisClient.ltrim('messages', 0, 20);
  })
}


// listen on connection event for incoming sockets
io.on('connection', function(socket){
  socket.on('join', function(username){
    // set username associated with a client
    socket.username = username;
    io.emit('join', username + ' has joined.');

    redisClient.lrange('messages', 0, -1, function(err, message){
      messages = messages.reverse();
      messages.forEach(function(message){
        message = JSON.parse(message);
        io.emit('messages', message.name + ": " + message.data);
      })
    });


  });
  // on incoming 'chat message' event, send message
  socket.on('chat message', function(msg){
    // print username of client with broadcasting message
    socket.on(socket.username, function(err, name){
      storeMessage(name, msg);
    })
    io.emit('chat message', socket.username + ': ' + msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});