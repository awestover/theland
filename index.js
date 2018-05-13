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

var worldCounts = {};

function newConnection(socket) {
	/*
		socket.on  - when this specific socket instance (which indexjs holds all of the sockets) hears something

		socket.emit - emit to this socket only
		socket.broadcast - to all other people
		io.sockets.emit - to everyone
	*/

  console.log("new connection");
  var name;
  var world;

  // what to listen for
  socket.on('named', handleNaming);
  socket.on('sendWorld', handleSendWorld);
  socket.on('updatePlayer', updatePlayer);
  socket.on('pushAnimalUpdate', pushAnimalUpdate);
  // socket.on('loadPlayers', loadPlayers);

  function handleSendWorld(data)
  {
  	world = data["world"];

    if  (!world)
    {
      world = "World";
    }

    // 12 ppl max in the world (it is a clock!!!!!)
    while (worldCounts[world] && worldCounts[world] >= 12)
    {
      world += Math.floor(10*Math.random());
    }

    if (worldCounts[world])
    {
      worldCounts[world] += 1;
    }
    else {
      worldCounts[world] = 1;
    }

  	socket.join(world); // join a world... this means you can have a private conversation within that world

    console.log(worldCounts);
    console.log("world chosen " + world);

    // what world did we really join?...
    socket.emit("worldChosen", {"world":world, "ourTheta": worldCounts[world]-1});
  }

  function updatePlayer(user)
  {
  	// don't emit to yourself or people in other worlds
  	socket.broadcast.to(user.world).emit("updatePlayer", user);
    // io.sockets.emit("updatePlayer", data);
  }

  function pushAnimalUpdate(data)
  {
    console.log(data);
    socket.broadcast.to(data.world).emit("pushedAnimalUpdate", data);
  }

  function handleNaming(data)
  {
    // later do not allow duplicates
    name = data["name"];

    if (!name)
    {
      name = "User";
    }

    if (name=="NONE")
    {
      name="fakeNONE";
    }

    if(name=="NPC")
    {
      name = "fakeNPC";
    }

    while (nameExists(name)!=0)
    {
    	name = name + Math.floor(Math.random()*10);
    }

    console.log(name + " added" );
    playersConnected.push(name);
    console.log("Now playing: ");
    console.log(playersConnected);

    socket.emit('nameChosen', name);

  }

  socket.on('disconnect', handleDisconnect);
  function handleDisconnect(data)
  {
    worldCounts[world] -= 1;

    var idx = playersConnected.indexOf(name);
    console.log("disconnect by " + idx + " " + name);
    if (idx != -1)
    {
      playersConnected.splice(idx, 1); // 1 means remove 1 thing
      console.log("Now playing: ");
      console.log(playersConnected);

	  // don't emit to yourself or people in other worlds
  	  socket.broadcast.to(world).emit("deletePlayer", {"name": name});
      // io.sockets.emit("deletePlayer", {"name":name});
    }
  }

}

function nameExists(name)
{
	var ct=0;
	for (var i = 0; i<playersConnected.length; i++)
	{
		if (playersConnected[i] == name)
		// if (playersConnected[i].indexOf(name)!=-1)
		{
			ct+=1;
		}
	}
	return ct;
}
