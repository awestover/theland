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

  for (var otherUser in otherUsers)
  {
    console.log(otherUser["user"]);
  }

}

function handleUpdatePlayer(data)
{
  otherUsers[data["name"]] = data["state"];
  console.log(otherUsers);

}




//
