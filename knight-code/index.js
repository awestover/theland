// behind the scenes of the game
var express = require('express'); // needs this library
var app = express();
var port = process.env.PORT || 3000;  // what port to open it on must have the option to be
// chosen by server if you want it to be heroku compatible, also does need the default
var server = require('http').createServer(app).listen(port);
var socket = require('socket.io');
var io = socket(server);
app.use(express.static('public'));
console.log("server running");

io.sockets.on('connection', newConnection);  // when you get a connection do this

// store dictionaries of data for all users
// this would be nice, too hard for now though
// var playerData = {}

var playersConnected = [];

function newConnection(socket) {
  console.log("new connection");
  var name;

  // what to listen for
  socket.on('named', handleNaming);
  socket.on('updatePlayer', updatePlayer);
  // socket.on('loadPlayers', loadPlayers);

  function updatePlayer(data)
  {
    io.sockets.emit("updatePlayer", data);
  }

  function handleNaming(data)
  {
    // later do not allow duplicates
    name = data["name"];
    console.log(name + " added" );
    playersConnected.push(name);
  }

  socket.on('disconnect', handleDisconnect);
  function handleDisconnect(data)
  {
    var idx = playersConnected.indexOf(name);
    console.log("disconnect by " + idx + " " + name);
    console.log(playersConnected);
    if (idx != -1)
    {
      playersConnected.pop(name);
      io.sockets.emit("deletePlayer", {"name":name});
    }
  }


    // // these are the functions that send data
    // function updatePlayerData(data)
    // {
    //   // does the world not exist?
    //   if (!playerData[data["world"]])
    //   {
    //     playerData[data["world"]];
    //   }
    //
    //   playerData[data["world"]][data["name"]] = data["state"];
    //   console.log(playerData);
    //
    //   io.sockets.emit('')

    //  alternative:
    //    socket.broadcast.emit(x, y)
    //
    // }

}



//
