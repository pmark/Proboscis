
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app);


// Set up socket.io
var io = require('socket.io').listen(server);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var socketClients = []; 

io.sockets.on('connection', function (socket) {
  socketClients.push(socket);
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

function broadcast(eventName, eventData) {
  socketClients.forEach(function(socket, i) {
    console.log("client ", i);
    socket.emit(eventName, eventData);
  });
};


// Here's Johnny...
var five = require("johnny-five"),
    board, 
    motion,
    led1,
    led2;

board = new five.Board();

board.on("ready", function() {

  motion = new five.IR.Motion(7);
  led1 = new five.Led(13);
  led2 = new five.Led(11);

  led1.on();
  led2.on();


  // "calibrated" occurs once, at the beginning of a session,
  motion.on("calibrated", function( err, ts ) {
    console.log( "calibrated", ts );
    led1.on();
    led2.off();
  });

  // "motionstart" events are fired when the "calibrated"
  // proximal area is disrupted, generally by some form of movement
  motion.on("motionstart", function( err, ts ) {
    console.log("- motionstart", ts );
    // broadcast("motionstart", null);
    led1.off();
    led2.on();
  });
  
  // "motionstart" events are fired following a "motionstart event
  // when no movement has occurred in X ms
  motion.on("motionend", function( err, ts ) {
    console.log("- motionend", ts );
    // broadcast("motionend", null);
    led1.on();
    led2.off();
  });

});
