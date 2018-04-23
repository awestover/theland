// main user interaction

/*
Notes:

theland.herokuapp.com is the new name

if you use it in browser on a phone, it will be annoying
later try to make it better: ie make reload harder, no scrolling etc

Improvements: boundaries need to work

*/

let socket;
let user;
let screen_dims;
let real_screen_dims = [512, 512];
let canvas;

let last_down = [0, 0];
let isDown = false;

const animal_names = ["dog", "shark"];
const animal_size = [66, 50];

let otherUsers = {};

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

  // fill in all fields later
  user = new User({"animal_type": pickRandom(animal_names)[0]});

  let name = prompt("Name");
  socket.emit("named", {"name":name});
  let world = prompt("World");
  socket.emit("sendWorld", {"world":world});

}

function draw()
{
  background(255,0,255);
  // center to 0,0
  translate(screen_dims[0]/2, screen_dims[1]/2);
  textAlign(CENTER);

  push();
  translate(user.pos[0], user.pos[1]);
  user.show();

  for (var key in otherUsers)
  {
    otherUsers[key].show();
  }

  drawTerritory(user.th, user.name);

  let drawTerrct = 1; // already did current user
  for (let key in otherUsers)
  {
    // console.log(otherUsers[key].name);
    drawTerritory(otherUsers[key].th, otherUsers[key].name);
    drawTerrct += 1;
  }

  while(drawTerrct < 12)
  {
    drawTerritory(drawTerrct, "unclaimed");
    drawTerrct += 1;
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

  drawCenterCross();

}

function drawCenterCross()
{
  fill(0, 0, 0);
  rect(-5, -0.25, 10, 0.5);
  rect(-0.25, -5, 0.5, 10);
}

function handleUpdatePlayer(data)
{
  // console.log("update handle");
  // console.log(data["user"]["name"]);
  var cAnimals = [];
  for (var i = 0; i < data["user"]["animals"].length; i++)
  {
    cAnimals.push(new Personal(data["user"]["animals"][i]));
  }

  var new_data = {
    "animals": cAnimals,
    "name": data["user"]["name"],
    "world": data["user"]["world"],
    "animal_type":data["user"]["animal_type"],
    "th": data["user"]["th"]
  }

  //note names are unique
  otherUsers[new_data["name"]] = new User(new_data);

}

function handleDeletePlayer(data)
{
  console.log("deleting " + data["name"]);
  delete otherUsers[data["name"]];
  // let i=0;
  // for (i = 0; i < otherUsers.length; i++)
  // {
  //     if (otherUsers.name == data["name"])
  //     {
  //       break;
  //     }
  // }
  // if (i!= -1)
  // {
  //   otherUsers.splice(i, 1);
  // }
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
  // console.log(data);
  user.world = data["world"];
  user.th = data["ourTheta"];
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

function drawTerritory(th, name)
{
  let result = calculateTerritory(th);
  fill(0, 255, 255, 100);
  ellipse(result[0], result[1], result[2], result[2]);
  fill(0,0,0);
  if (name)
  {
    text(name, result[0], result[1]);
  }
}

function calculateTerritory(th)
{
  // note: divide into 12 parts, th is an index not an absoulte angle
  // need to implement -1500 to 1500 grid boundary with lava on the edge
  // 1000 away from 0,0 100 radius
  // WORRY ABOUT UNITS (later)
  // PEOPLE AREN'T die if they try to go in here
  let bigR = 1000;
  let littleR = 300;
  let loc = [Math.cos(th*Math.PI/6)*bigR, Math.sin(th*Math.PI/6)*bigR];
  return [loc[0], loc[1], littleR];
}
