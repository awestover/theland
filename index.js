// behind the scenes of the game
var express = require('express'); // needs this library
var app = express();
var port = process.env.PORT || 3000;  // what port to open it on must have the option to be
// chosen by server if you want it to be heroku compatible, also does need the default
let server = require('http').createServer(app).listen(port);
let socket = require('socket.io');
let io = socket(server);
app.use(express.static('public'));

const { Client } = require('pg');

function queryDb(qu)
{
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    });
    client.connect();
    var results = [];
    client.query(qu, (err, res) => {
      if (err) throw err;
      for (let row of res.rows) {
        var cRow = JSON.stringify(row);
        console.log(cRow);
        results.push(cRow);
      }
      client.end();
    });
  }
  catch (error) {
      console.log(error);
      return [];
  } finally {
    console.log("queryDb " + qu);
    console.log(results);
    return results;
  }
}

function safer(s)
{
  return s.replace(";", "").replace('"', '').replace("'", '').replace("-", '');
}

function formInsert(vals)
{
  var qu = "INSERT INTO users VALUES(";
  for (var i = 0; i < vals.length; i++)
  {
    try {
      qu += "'" + safer(vals[i]) + "'";
    }
    catch (e) {
      qu += vals[i]+"";
    }
    if (i!= vals.length-1)
    {
      qu += ', ';
    }
    else {
      qu += ");";
    }
  }
  return qu;
}

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// handle posts
app.post('/', function(req, res) {
    var unm = req.body.unm;
    var pwd = req.body.pwd;
    var world = req.body.world;
    var anType = req.body.anType;
    var soundWanted = req.body.soundWanted;

    var pwdGood = false;

    if (pwd.length>0)
    {
      var qu = "SELECT * FROM users WHERE name='"+safer(unm)+"';";
      var qRes = queryDb(qu);
      if (qRes['password'] == pwd)
      {
        pwdGood = true;
      }
    }

    var verified = "no";
    if (pwdGood)
    {
      console.log("legit user");
      verified = "yes";
    }
    res.redirect("game.html?"+joinIns([unm, world, anType, soundWanted, verified], ["unm", "world", "anType","soundWanted", "verified"]));
});

app.post('/register', function(req, res) {
  var unm = req.body.unm;
  var pwd = req.body.pwd;
  var level = 1;
  var quest = 'none';

  var qu = "SELECT * FROM users WHERE name='"+safer(unm)+"';";
  var dRes = queryDb(qu);
  qu = "SELECT * FROM users;";
  dRes = queryDb(qu);
  if (dRes.length==0)
  {
    queryDb(formInsert([unm, quest, level, pwd]));
    res.redirect("index.html");
  }
  else {
    res.redirect("register.html?failed=username_exists");
  }

});

console.log("server running");
io.sockets.on('connection', newConnection);  // when you get a connection do this

var playersConnected = [];
var worldThetas = {};

var userData = {};

var maxSLength = 15;

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
  var th;

  // what to listen for
  socket.on('named', handleNaming);
  socket.on('sendWorld', handleSendWorld);
  socket.on('updatePlayer', updatePlayer);
  socket.on('pushAnimalUpdate', pushAnimalUpdate);
  socket.on('deathAlert', handleDeath);
  socket.on('choseAnimalType', handleChoseAnimalType);

  socket.on('getData', sendData);
  function sendData(data)
  {
    socket.emit('gotData', userData);
  }

  function handleChoseAnimalType(data)
  {
    userData[name].push(data["animalType"]);
  }

  function handleSendWorld(data)
  {
  	world = data["world"];

    if  (!world)
    {
      world = "World";
    }

    if (world.length > maxSLength)
    {
      world = world.slice(0, maxSLength);
    }

    // 12 ppl max in the world (it is a clock!!!!!)
    while (worldThetas[world] && worldThetas[world].length >= 12)
    {
      world += Math.floor(10*Math.random());
    }

    if (worldThetas[world])
    {
      var ii=0;
      while (ii < worldThetas[world].length && worldThetas[world][ii]==ii)
      {
        ii += 1;
      }
      worldThetas[world].splice(ii,0, ii);// insert into that position that value
      th=ii;
    }
    else {
      worldThetas[world] = [0];
      th=0;
    }

    userData[name].push(world);
    userData[name].push(th);

  	socket.join(world); // join a world... this means you can have a private conversation within that world

    // console.log(worldThetas);
    console.log("world chosen " + world);

    // what world did we really join?...
    socket.emit("worldChosen", {"world":world, "ourTheta": th});
  }

  function updatePlayer(user)
  {
  	// don't emit to yourself or people in other worlds
  	socket.broadcast.to(user.world).emit("updatePlayer", user);
    // io.sockets.emit("updatePlayer", data);
  }

  function pushAnimalUpdate(data)
  {
    socket.broadcast.to(data.world).emit("pushedAnimalUpdate", data);
  }

  function handleNaming(data)
  {
    // later do not allow duplicates
    name = data["name"];

    if (!name){name = "User";}
    if (name=="NONE"){name="fakeNONE";}
    if(name=="NPC"){name="fakeNPC";}

    if (name.length > maxSLength)
    {
      name = name.slice(0,maxSLength)
    }

    while (nameExists(name)!=0) {
    	name = name + Math.floor(Math.random()*10);
    }

    console.log(name + " added" );
    playersConnected.push(name);
    userData[name] = [name];
    console.log("Now playing: ");
    console.log(playersConnected);

    socket.emit('nameChosen', name);
  }

  function handleDeath(data)
  {
    io.to(data["world"]).emit("death", data);
  }

  socket.on('disconnect', handleDisconnect);
  function handleDisconnect(data)
  {
    if (world)
    {
      try {
        for (var i = 0; i < worldThetas[world].length; i++)
        {
          if (th == worldThetas[world][i])
          {
            worldThetas[world].splice(i,1);
            break;
          }
        }
      }
      catch (e) {
        console.log("ERROR " + e);
      }
      var idx = playersConnected.indexOf(name);
      console.log("disconnect by " + idx + " " + name);
      if (idx != -1)
      {
        delete userData[name];
        playersConnected.splice(idx, 1); // 1 means remove 1 thing
        console.log("Now playing: ");
        console.log(playersConnected);

  	     // don't emit to yourself or people in other worlds
         socket.broadcast.to(world).emit("deletePlayer", {"name": name});
         // io.sockets.emit("deletePlayer", {"name":name});
      }
    }
    else {
      console.log("disconnect on HOME PAGE");
    }
  }

}

function joinIns(ins, fields)
{
	var out = "";
	if (ins.length<1)
	{
		return out;
	}
	for (var i = 0; i < ins.length-1; i++)
	{
		out+=fields[i]+"="+ins[i]+"&";
	}
	out+= fields[ins.length-1]+"="+ins[ins.length-1];
	return out;
}

function nameExists(name)
{
	var ct=0;
	for (var i = 0; i<playersConnected.length; i++)
	{
    // if (playersConnected[i].indexOf(name)!=-1)
		if (playersConnected[i] == name)
		{
			ct+=1;
		}
	}
	return ct;
}
