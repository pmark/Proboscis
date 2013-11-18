
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var proboscis = require('./proboscis');
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

var server = http.createServer(app);

// Set up socket.io
// var socketClients = []; 
// var io = require('socket.io').listen(server);
// io.sockets.on('connection', function (socket) {
//   socketClients.push(socket);
//   socket.emit('news', { hello: 'world' });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });
// function broadcast(eventName, eventData) {
//   socketClients.forEach(function(socket, i) {
//     console.log("client ", i);
//     socket.emit(eventName, eventData);
//   });
// };

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


