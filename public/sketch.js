// main user interaction

let socket;
let user;
let screen_dims;
let canvas;

let otherUsers = {};

function setup()
{
  screen_dims = [windowWidth, windowHeight];
  canvas = createCanvas(screen_dims[0]*0.9, screen_dims[1]*0.9);
  frameRate(10);

  socket = io.connect();

  let name = prompt("Name");
  socket.emit("named", {"name":name});
  let world = prompt("World");
  user = new User(name, world);

  socket.on("updatePlayer", handleUpdatePlayer);
  socket.on("deletePlayer", handleDeletePlayer);

}

function draw()
{
  background(255,0,255);
  fill(0,0,255);
  text(user.getName(), 200,20);

  let data = {
    "user": user
  };
  socket.emit("updatePlayer", data);


  var msg = "";
  for (var otherUser in otherUsers)
  {
    // console.log(otherUser["user"]);
    msg += otherUser["animals"];
  }
  // console.log(msg);

}

function handleUpdatePlayer(data)
{
  // console.log("update handle");
  // console.log(data["user"]["name"]);

  var new_data = {
    "animals": data["user"]["animals"],
    "name": data["user"]["name"]
  }
  otherUsers[data["user"]["name"]] = new_data;

}

function handleDeletePlayer(data)
{
  console.log("deleting" + data["name"]);
  delete otherUsers[data["name"]];
}


//
