// behind the scenes of the game
var express = require('express'); // needs this library
var app = express();
var port = process.env.PORT || 3000;  // what port to open it on must have the option to be
// chosen by server if you want it to be heroku compatible, also does need the default
var server = require('http').createServer(app).listen(port);
app.use(express.static('public'));
console.log("server running");
var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection', newConnection);  // when you get a connection do this

function newConnection(socket) {
  // what to listen for
    socket.on('key', keyMsg);
    socket.on('updatePlayer', locMsg);
    socket.on('shoot', shootMsg);

  // these are the functions that send data

    function keyMsg(key_data)
    {
        io.sockets.emit('key', key_data);
    }

    function shootMsg(shoot_data)
    {
        io.sockets.emit('shoot', shoot_data);
    }

    function locMsg(loc_data)
    {
        socket.broadcast.emit('updatePlayer', loc_data);
    }
}
