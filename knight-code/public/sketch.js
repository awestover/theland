// main user interaction

let socket;
let user;
let screen_dims;
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

  let name = prompt("Name");
  socket.emit("named", {"name":name});
  let world = prompt("World");
  user = new User(name, world, pickRandom(animal_names)[0]);

  socket.on("updatePlayer", handleUpdatePlayer);
  socket.on("deletePlayer", handleDeletePlayer);

  // set name and world
  $('#name').text("Name: " + name);
  $('#world').text("World: " + world);

}

function draw()
{
  background(255,0,255);
  
  push();
  translate(user.pos[0], user.pos[1]);
  let newAnimals = user.show();

  for (var i = 0; i < newAnimals.length; i++)
  {
    user.addOffspringAnimal(newAnimals[i]);
  }

  pop();

  fill(0, 0, 0);
  rect(screen_dims[0]/2-5, screen_dims[1]/2-0.25, 10, 0.5);
  rect(screen_dims[0]/2-0.25, screen_dims[1]/2-5, 0.5, 10);

  user.update();

  if (isDown)
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

  let data = {
    "user": user
  };
  socket.emit("updatePlayer", data);


  // var msg = "";
  for (var otherUser in otherUsers)
  {
    // console.log(otherUsers[otherUser]);
    // msg += otherUser["animals"];
    for (var cAnimal in otherUsers[otherUser]["animals"])
    {
      otherUsers[otherUser]["animals"][cAnimal].show();
      // console.log(otherUsers[otherUser]["animals"][cAnimal].getPos());
    }
  }
  // console.log(msg);

}

function handleUpdatePlayer(data)
{
  // console.log("update handle");
  // console.log(data["user"]["name"]);

  // console.log();

  var cAnimals = [];
  for (var i = 0; i < data["user"]["animals"].length; i++)
  {
    cAnimals.push(new Animal(data["user"]["animals"][0]));
    // cAnimals.push(new Animal({"pos": data["user"]["animals"][i]}));
  }

  var new_data = {
    "animals": cAnimals,
    "name": data["user"]["name"]
  }
  otherUsers[data["user"]["name"]] = new_data;

  // don't really need User objects...
  // does it exist?
  // if (otherUsers[data["user"]["name"]])
  // {
  //   otherUsers[new_data["name"]].setAnimalsPos(new_data["animals"])
  // }
  // else {
  //   otherUsers[new_data["name"]] = new User();
  // }


}

function handleDeletePlayer(data)
{
  console.log("deleting" + data["name"]);
  delete otherUsers[data["name"]];
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

function onCanvas(pos)
{
  return (pos[0] > 0 && pos[0] < screen_dims[0] && pos[1] > 0 && pos[1] < screen_dims[1]);
}

// pick random element from list
function pickRandom(list)
{
  var idx = Math.floor(Math.random()*list.length);
  return [list[idx], idx];
}
