/* Main user interaction
Alek Westover
Notes:

theland.herokuapp.com is the new name

if you use it in browser on a phone, it will be annoying
later try to make it better: ie make reload harder, no scrolling etc

TODO:
animals tend towards cursor

boundaries need to work, possible glitch drawing 2 boundaries in the same place...

edges: fire, no scroll past no go past

efficient collision checking?

Predator and prey npcs

IF mouse Animal collision show animal full stats

*/

let socket;
let user;
let screen_dims;
let canvas;

let last_down = [0, 0];
let isDown = false;

// all animal names
const animal_names = ["dog", "shark", "bear"];
const max_lvl = 2;
const animal_size = [66, 50];
let animal_pictures = {};

// screen dimensions
const gridSize   = 1000;//2500;
const boundSize = 100;
const territoryR = 300//500;
const bounds = [[-gridSize, gridSize], [-gridSize, gridSize]];
let edgeRects = [];
let territoryLocs = [];

let otherUsers = {};
let gametree;

function setup()
{
  for (let m = 1; m<=max_lvl; m++)
  {
    for(let i = 0; i < animal_names.length; i++)
    {
      let cName = animal_names[i] + m;
      animal_pictures[cName] = loadImage("pictures/"+cName+".png");
    }
  }

  screen_dims = [windowWidth*0.95, windowHeight*0.85];
  canvas = createCanvas(screen_dims[0], screen_dims[1]);
  textAlign(CENTER);
  frameRate(10);

  socket = io.connect();
  socket.on("updatePlayer", handleUpdatePlayer);
  socket.on("deletePlayer", handleDeletePlayer);
  socket.on('nameChosen', handleNameChosen);
  socket.on('worldChosen', handleWorldChosen);

  user = new User({"animal_type": pickRandom(animal_names)[0]});
  let name = prompt("Name");
  socket.emit("named", {"name":name});
  let world = prompt("World");
  socket.emit("sendWorld", {"world":world});
  user.addAnimal();

  edgeRects = calculateEdge();
  for (let th = 0; th < 12; th++)
  {
    territoryLocs[th] = calculateTerritory(th);
  }

  gametree = new Gametree();

}

function draw()
{
  // graphics basis
  background(205,50,205);
  translate(screen_dims[0]/2, screen_dims[1]/2);  // center to 0,0

  // show major elements and get ready to check for collisions
  push();
  translate(user.pos[0], user.pos[1]);
  user.show();

  gametree.clear();
  gametree.insertUser(user);

  for (var key in otherUsers)
  {
    otherUsers[key].show();
    gametree.insertUser(otherUsers[key]);
  }

  // draw the territories

  let thNames = {};
  for (let key in otherUsers)
  {
    thNames[otherUsers[key].th] = otherUsers[key].name;
  }

  for (let cth = 0; cth < 12; cth++)
  {
    if (cth == user.th)
    {
      drawTerritory(user.th, user.name);
    }
    else if (thNames[cth])
    {
      drawTerritory(cth, thNames[cth]);
    }
    else {
      drawTerritory(cth, "unclaimed");
    }

  }

  // look at collisions
  let collisions = gametree.getCollisions();
  for (let c = 0; c<collisions.length; c++)
  {
    noFill();
    let gcs = [gametree.get(collisions[c][0]), gametree.get(collisions[c][1])];
    if (user.name=="alek"||user.name=="a")
    {
      dRect(gcs[0].getBox());
      dRect(gcs[1].getBox());
    }
    gcs[0].handleCollide(gcs[1]);
    gcs[1].handleCollide(gcs[0]);
  }

  drawEdge(); // not allways needed...
  drawOrigin();

  pop();

  //update animals, send data
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

  //handle drag
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

function drawOrigin()
{
  noFill();
  stroke(0,0,0);
  ellipse(0,0,10,10);
}

function handleUpdatePlayer(data)
{
  // console.log("Update player " + data["user"]["name"]);
  var cAnimals = [];
  for (var i = 0; i < data["user"]["animals"].length; i++)
  {
    cAnimals.push(new Animal(data["user"]["animals"][i]));
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

function vecScalarMult(x, k)
{
  let u = [];
  for (let i = 0; i < x.length; i++)
  {
    u.push(k*x[i]);
  }
  return u;
}

function handleDeletePlayer(data)
{
  console.log("deleting " + data["name"]);
  delete otherUsers[data["name"]];
  // splice(x, 1) to remove element NOT pop (pop does 0th element allways)
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
  user.th = data["ourTheta"];
  user.pos = negateV(territoryLocs[user.th]);
  $('#world').text("World: " + user.world);
}

function negateV(v)
{
  let out = [];
  for (let i = 0; i < v.length; i++)
  {
    out.push(-1*v[i]);
  }
  return out;
}

function handleNameChosen(data)
{
  user.name = data;
  user.giveAnimalsName();

  if (user.name == "alek")
  {
    user.knights = 100000;
    for (var i = 0; i < 20; i++)
    {
      user.addAnimal();
    }
  }

  $('#name').text("Name: " + user.name);
}

function onCanvas(pos)
{
  let xIn = (pos[0] > 0 && pos[0] < screen_dims[0]);
  let yIn = (pos[1] > 0 && pos[1] < screen_dims[1]);
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
  fill(0, 255, 255, 100);
  ellipse(territoryLocs[th][0], territoryLocs[th][1], territoryR, territoryR);
  fill(0,0,0);
  if (name)
  {
    text(name, territoryLocs[th][0], territoryLocs[th][1]);
  }
}

function dRect(arr)
{
  rect(arr[0], arr[1], arr[2], arr[3]);
}

function calculateTerritory(th)
{
  /*
  note: divide into 12 parts, th is an index not an absoulte angle
  need to implement grid boundary with lava on the edge
  */
  return [Math.cos(th*Math.PI/6)*gridSize*0.6, Math.sin(th*Math.PI/6)*gridSize*0.6];
}

function drawEdge()
{
  noStroke();
  fill(200, 20, 20);
  for (let i = 0; i<4; i++)
  {
    dRect(edgeRects[i]);
  }
}

function onEdge(boxa)
{
  for (let i = 0; i < edgeRects.length; i++)
  {
    if(gametree.checkBoxCollide(edgeRects[i], boxa))
    {
      return true;
    }
  }
  return false;
}

function violateEdge(boxa)
{
  return (Math.abs(boxa[0])>(gridSize-boundSize) || Math.abs(boxa[1]) > (gridSize -boundSize) ||
    Math.abs(boxa[1]+boxa[3])>(gridSize-boundSize) || Math.abs(boxa[0]+boxa[2])> (gridSize-boundSize));
}

function boxInTerritory(boxCoords)
{
  for (let th = 0; th < territoryLocs.length; th++)
  {
    if(rectInCircle(boxCoords, [territoryLocs[th], territoryR]))
    {
      return true;
    }
  }
  return false;
}

function rectInCircle(boxCoords, circleCoords)
{
  /*circle rectangle collision
  easier to think of circle running into rectangle, even though it is the other way arround
  Basic idea: if the point on the square which is closest to the circle isn't in the circle there is not collision
  otherwise there is collision.
  Clamp opperation: get the point in the sqare closest to the circles center X and Y
  */
  let x = boxCoords[0]; let y = boxCoords[1];
  let w = boxCoords[2]; let h = boxCoords[3];
  let xc = circleCoords[0][0]; let yc = circleCoords[0][1];
  let r = circleCoords[1];

  // gives center if circle is in rectangle, otherwise gives the coordinates of the closest side (x and y)
  let nearX = max(x, min(xc, x+w) );
  let nearY = max(y, min(yc, y+h) );

  let dx = nearX - xc; let dy = nearY - yc;

  return (dx*dx + dy*dy <= r*r);

}

function calculateEdge()
{
  /*
  NOTE: this is BROKEN currently. The screen is weird... + is to the left in x....

  A rectangular border arround the whole grid at the furthest locations from center
  */
  let brw = boundSize; let brh = boundSize;
  let brs = [[],[],[],[]];
  brs[0] = [bounds[0][0], bounds[1][0], brw, bounds[1][1]-bounds[1][0]];
  brs[1] = [bounds[0][0], bounds[1][0], bounds[0][1]-bounds[0][0], brh];
  brs[2] = [bounds[0][1]-brw, bounds[1][0], brw, bounds[1][1]-bounds[1][0]];
  brs[3] = [bounds[0][0], bounds[1][1]-brh, bounds[0][1]-bounds[0][0], brh];
  return brs;
}
