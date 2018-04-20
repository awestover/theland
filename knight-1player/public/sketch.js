// main user interaction

let user;
let screen_dims;
let canvas;

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
  fill(0,0,255);
  text(user.name, 200,20);

  user.show();
  user.update();

}


// pick random element from list
function pickRandom(list)
{
  var idx = Math.floor(Math.random()*list.length);
  return [list[idx], idx];
}
