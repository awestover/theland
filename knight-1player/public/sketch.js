// main user interaction

let user;
let screen_dims;
let canvas;

let last_down = [0, 0];

const animal_names = ["dog", "shark"];
const animal_size = [66, 50];

function setup()
{
  screen_dims = [windowWidth*0.95, windowHeight*0.85];
  canvas = createCanvas(screen_dims[0], screen_dims[1]);
  frameRate(10);

  let name = "Alek";
  let world = "The Land";
  user = new User(name, world, pickRandom(animal_names)[0]);

  // set name and world
  $('#name').text("Name: " + name);
  $('#world').text("World: " + world);


}

function draw()
{
  background(255,0,255);

  push();
  translate(user.pos[0], user.pos[1]);
  user.show();
  pop();

  fill(0, 0, 0);
  ellipse(screen_dims[0]/2, screen_dims[1]/2, 10, 10);

  user.update();

}

// do it continously now
function touchMoved() {
  let current_pos = [mouseX, mouseY];
  user.updateView(last_down, current_pos);
  last_down = [mouseX, mouseY];
  return false;
}

function touchStarted()
{
  last_down = [mouseX,mouseY];
  return false;
}

// function touchEnded()
// {
//   let current_pos = [mouseX, mouseY];
//   user.updateView(last_down, current_pos);
//   // console.log(current_pos);
//   return false;
// }


// pick random element from list
function pickRandom(list)
{
  var idx = Math.floor(Math.random()*list.length);
  return [list[idx], idx];
}
