/* Main user interaction
Alek Westover
theland.herokuapp.com
*/

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

  let animalType = parseInt(prompt(animal_txt_help));
  if (isNaN(animalType) || animalType < 0 || animalType >= animal_names.length)
  {
    animalType = pickRandom(animal_names)[0];
  }
  else {
    animalType = animal_names[animalType];
  }
  user = new User({"animal_type": animalType});
  user.setAnimalType();
  let name = prompt("Name");
  socket.emit("named", {"name":name});
  let world = prompt("World");
  socket.emit("sendWorld", {"world":world});
  user.addAnimal();
  user.addPrey();
  user.addPrey();

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

  for (let key in otherUsers)
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
    if (user.name=="lbd")
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
  for (let i = 0; i < newAnimals.length; i++)
  {
    user.addOffspringAnimal(newAnimals[i]);
  }
  // let data = {
  //   "user": user,
  //   "world": user.world
  // };
  socket.emit("updatePlayer", user);

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

  handleKeysDown();
  if(scoresVisible)
  {
    showMaxScores();
  }

  drawCenterCross();

}

function handleUpdatePlayer(otherUser)
{
  for (let i = 0; i < otherUser.animals.length; i++)
  {
    otherUser.animals[i] = new Personal(otherUser.animals[i]);
  }
  for (let i = 0; i < otherUser.preys.length; i++)
  {
    otherUser.preys[i] = new Prey(otherUser.preys[i]);
  }
  for (let i = 0; i < otherUser.predators.length; i++)
  {
    otherUser.predators[i] = new Predators(otherUser.predators[i]);
  }
  otherUsers[otherUser.name] = new User(otherUser);
}

function handleDeletePlayer(data)
{
  console.log("deleting " + data["name"]);
  delete otherUsers[data["name"]];
  // splice(x, 1) to remove element
}

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

function handleKeysDown() {
  // let lkey = key.toLowerCase();
  let keyD = 30;
  if (keyIsDown(LEFT_ARROW) || keyIsDown(keyCodes['a'])) {
    user.updateView(user.pos, addV(user.pos, [keyD, 0]));
  }
  else if (keyIsDown(RIGHT_ARROW) || keyIsDown(keyCodes['d'])) {
    user.updateView(user.pos, addV(user.pos, [-keyD, 0]));
  }
  if (keyIsDown(UP_ARROW) || keyIsDown(keyCodes['w'])) {
    user.updateView(user.pos, addV(user.pos, [0, keyD]));
  }
  else if (keyIsDown(DOWN_ARROW) || keyIsDown(keyCodes['s'])) {
    user.updateView(user.pos, addV(user.pos, [0, -keyD]));
  }
}

function keyPressed()
{
  let lk = key.toLowerCase();
  if (lk=='b')
  {
    user.buyAnimal();
  }
  else if (lk=='t')
  {
    user.toggleAttractAnimals();
  }
  else if (lk=='s')
  {
    toggleScores();
  }
  else if (lk=='c')
  {
    user.knights+=100;
  }
}


function handleWorldChosen(data)
{
  user.world = data["world"];
  user.th = data["ourTheta"];
  user.pos = negateV(territoryLocs[user.th]);
  $('#world').text("World: " + user.world);
}

function handleNameChosen(data)
{
  user.name = data;
  user.giveAnimalsName();

  if (user.name == "lbd")
  {
    user.knights = 100000;
    for (let i = 0; i < 4; i++)
    {
      user.addAnimal();
    }
  }

  $('#name').text("Name: " + user.name);
}
