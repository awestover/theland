// main user interaction

let socket;
let user;
let screen_dims;
let canvas;

let last_down = [0, 0];
let isDown = false;

const animal_names = ["dog", "shark"];
const animal_size = [66, 50];

let otherUsers = [];
let ourTheta;

function setup()
{
  screen_dims = [windowWidth*0.95, windowHeight*0.85];
  canvas = createCanvas(screen_dims[0], screen_dims[1]);
  frameRate(10);

  socket = io.connect();
  socket.on("updatePlayer", handleUpdatePlayer);
  socket.on("deletePlayer", handleDeletePlayer);
  socket.on('nameChosen', handleNameChosen);
  socket.on('worldChosen', handleWorldChosen);

  let name = prompt("Name");
  socket.emit("named", {"name":name});
  let world = prompt("World");
  socket.emit("sendWorld", {"world":world});
  user = new User(name, world, pickRandom(animal_names)[0]);

}

function draw()
{
  background(255,0,255);


  // probably need to scale everything and translate everything to achieve cross platformness


  push();
  translate(user.pos[0], user.pos[1]);
  user.show();

  for (var key in otherUsers)
  {
    otherUsers[key].show();
  }

  for (let th = 0; th < 12; th++)
  {
    drawTerritory(th);
  }

  pop();

  let newAnimals = user.update();
  for (var i = 0; i < newAnimals.length; i++)
  {
    user.addOffspringAnimal(newAnimals[i]);
  }
  let data = {
    "user": user,
    "world": user.world
  };
  socket.emit("updatePlayer", data);

  if (isDown) // handle dragging
  {
    let current_pos = [mouseX, mouseY];
    if (onCanvas(current_pos))
    {
      user.updateView(last_down, current_pos);
      last_down = [mouseX, mouseY];
    }
    else {
      isDown = false;
    }
  }

  fill(0, 0, 0);
  rect(screen_dims[0]/2-5, screen_dims[1]/2-0.25, 10, 0.5);
  rect(screen_dims[0]/2-0.25, screen_dims[1]/2-5, 0.5, 10);

}

function handleUpdatePlayer(data)
{
  // console.log("update handle");
  // console.log(data["user"]["name"]);
  var cAnimals = [];
  for (var i = 0; i < data["user"]["animals"].length; i++)
  {
    cAnimals.push(new Animal(data["user"]["animals"][i]));
  }

  var new_data = {
    "animals": cAnimals,
    "name": data["user"]["name"],
    "world": data["user"]["world"],
    "animal_type":data["user"]["animal_type"]
  }
  otherUsers.push(new User(new_data["name"], new_data["world"], new_data["animal_type"], new_data["animals"]));

}

function handleDeletePlayer(data)
{
  console.log("deleting " + data["name"]);
  let i=0;
  for (i = 0; i < otherUsers.length; i++)
  {
      if (otherUsers.name == data["name"])
      {
        break;
      }
  }
  if (i!= -1)
  {
    otherUsers.splice(i, 1);
  }
}

// function touchMoved() {
//   return false
// }

// these are a little bit sketchy
function touchStarted()
{
  last_down = [mouseX, mouseY];
  isDown = true;
}

function touchEnded()
{
  isDown = false;
}

function handleWorldChosen(data)
{
  user.world = data["world"];
  ourTheta = data["ourTheta"];
  $('#world').text("World: " + user.world);
}

function handleNameChosen(data)
{
  // console.log("name " + data);
  user.name = data;

  if (user.name == "alek")
  {
    user.knights = 100000;
    for (var i = 0; i < 1000; i++)
    {
      user.addAnimal();
    }
  }

  $('#name').text("Name: " + user.name);
}

function onCanvas(pos)
{
  let xIn = pos[0] > 0 && pos[0] < screen_dims[0];
  let yIn = pos[1] > 0 && pos[1] < screen_dims[1];
  return (xIn && yIn);
}

// pick random element from list
function pickRandom(list)
{
  var idx = Math.floor(Math.random()*list.length);
  return [list[idx], idx];
}

function drawTerritory(name)
{
  let th = 0;
  for (th = 0; th<otherUsers.length; th++)
  {
    if (otherUsers[th].name == name)
    {
      break;
    }
  }
  let result = calculateTerritory(th);
  fill(0, 255, 255);
  ellipse(result[0], result[1], result[2], result[2]);
}

function calculateTerritory(th)
{
  // note: divide into 12 parts, th is an index not an absoulte angle
  // need to implement -1500 to 1500 grid boundary with lava on the edge
  // 1000 away from 0,0 100 radius
  // WORRY ABOUT UNITS (later)
  // PEOPLE AREN'T die if they try to go in here
  let bigR = 200;
  let littleR = 100;
  let loc = [Math.cos(th*Math.PI/6)*bigR, Math.sin(th*Math.PI/6)*bigR];
  return [loc[0], loc[1], littleR];
}
