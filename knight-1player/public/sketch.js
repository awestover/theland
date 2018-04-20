// main user interaction

let user;
let screen_dims;
let canvas;

const animal_names = ["dog", "shark"];

function setup()
{
  screen_dims = [windowWidth, windowHeight];
  canvas = createCanvas(screen_dims[0]*0.9, screen_dims[1]*0.9);
  frameRate(10);

  // let name = prompt("Name");
  let name = "alek";
  let world = "the land";
  user = new User(name, world);

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
  }


}


// pick random element from list
function pickRandom(list)
{
  var idx = Math.floor(Math.random()*list.length);
  return [list[idx], idx];
}
