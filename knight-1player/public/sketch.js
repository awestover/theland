// main user interaction

// let socket;
let user;
let screen_dims;
let canvas;

// let otherUsers = {};

function setup()
{
  screen_dims = [windowWidth, windowHeight];
  canvas = createCanvas(screen_dims[0]*0.9, screen_dims[1]*0.9);
  frameRate(10);

  // socket = io.connect();

  // let name = prompt("Name");
  let name = "alek";
  // socket.emit("named", {"name":name});
  // let world = prompt("World");
  let world = "the land";
  user = new User(name, world);

  // socket.on("updatePlayer", handleUpdatePlayer);
  // socket.on("deletePlayer", handleDeletePlayer);

}

function draw()
{
  background(255,0,255);
  fill(0,0,255);
  text(user.getName(), 200,20);

  for (var an in user.animals)
  {
    user.animals[an].show();
    user.animals[an].move();
    // console.log(user.animals[an]);
  }

  // let data = {
    // "user": user
  // };
  // socket.emit("updatePlayer", data);


  // var msg = "";
  // for (var otherUser in otherUsers)
  // {
  //   // console.log(otherUsers[otherUser]);
  //   // msg += otherUser["animals"];
  //   for (var cAnimal in otherUsers[otherUser]["animals"])
  //   {
  //     otherUsers[otherUser]["animals"][cAnimal].show();
  //     // console.log(otherUsers[otherUser]["animals"][cAnimal].getPos());
  //   }
  // }
  // console.log(msg);

}
//
// function handleUpdatePlayer(data)
// {
//   // console.log("update handle");
//   // console.log(data["user"]["name"]);
//
//   // console.log();
//
//   var cAnimals = [];
//   for (var i = 0; i < data["user"]["animals"].length; i++)
//   {
//     cAnimals.push(new Animal(data["user"]["animals"][0]));
//     // cAnimals.push(new Animal({"pos": data["user"]["animals"][i]}));
//   }
//
//   var new_data = {
//     "animals": cAnimals,
//     "name": data["user"]["name"]
//   }
//   otherUsers[data["user"]["name"]] = new_data;
//
//   // don't really need User objects...
//   // does it exist?
//   // if (otherUsers[data["user"]["name"]])
//   // {
//   //   otherUsers[new_data["name"]].setAnimalsPos(new_data["animals"])
//   // }
//   // else {
//   //   otherUsers[new_data["name"]] = new User();
//   // }
//
//
// }
//
// function handleDeletePlayer(data)
// {
//   console.log("deleting" + data["name"]);
//   delete otherUsers[data["name"]];
// }


//
