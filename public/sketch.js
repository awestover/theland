/* Main user interaction
Alek Westover
theland.herokuapp.com
*/

function setup()
{
  for (let an in allAnimals)
  {
    for (let m = 0; m<=max_lvls[allAnimals[an]]; m++)
    {
      for (let pn in animal_names[allAnimals[an]])
      {
        let cName = animal_names[allAnimals[an]][pn] + m;
        animal_pictures[cName] = loadImage("pictures/"+cName+".png");
      }
    }
  }

  screen_dims = [windowWidth*0.95, windowHeight*0.85];
  canvas = createCanvas(screen_dims[0], screen_dims[1]);
  textAlign(LEFT);
  frameRate(10);

  socket = io.connect();
  socket.on("updatePlayer", handleUpdatePlayer);
  socket.on("deletePlayer", handleDeletePlayer);
  socket.on('nameChosen', handleNameChosen);
  socket.on('worldChosen', handleWorldChosen);
  socket.on('pushedAnimalUpdate', handlePushedAnimalUpdate);
  socket.on('predatorKilled', handlePredatorKilled);

  let animalType = parseInt(prompt(animal_txt_help));
  if (isNaN(animalType) || animalType < 0 || animalType >= animal_names["personals"].length)
  {
    animalType = pickRandom(animal_names["personals"])[0];
  }
  else {
    animalType = animal_names["personals"][animalType];
  }
  user = new User({"animal_type": animalType});
  user.setAnimalType();
  let name = prompt("Name");
  socket.emit("named", {"name":name});
  let world = prompt("World");
  socket.emit("sendWorld", {"world":world});
  user.initAnimals();

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
  // background(205,50,205);
  background(2, 124, 57);
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

  user.update();
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
  for (let i = 0; i < otherUser.personals.length; i++)
  {
    otherUser.personals[i] = new Personal(otherUser.personals[i]);
  }
  for (let i = 0; i < otherUser.preys.length; i++)
  {
    otherUser.preys[i] = new Prey(otherUser.preys[i]);
  }
  for (let i = 0; i < otherUser.predators.length; i++)
  {
    otherUser.predators[i] = new Predator(otherUser.predators[i]);
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
  let rMPos=realPos([mouseX, mouseY]);
  let collisions = gametree.getCollisionsWith([rMPos[0], rMPos[1], 5, 5])
  if (collisions.length > 0)
  {
    let cidx = 0; // choose smart later if multiple collisions...
    let idx = collisions[cidx];
    if (gametree.values[idx].username == user.name)
    {
      gametree.values[idx].showStats = true;
    }
    else {
      let data = {
        "world": user.world,
        "username": gametree.values[idx].username,
        "type": gametree.values[idx].type,
        "id": gametree.values[idx].id,
        "updates":{"showStats": true}
      }
      socket.emit("pushAnimalUpdate", data);
    }
  }
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
    user.stormlight+=100;
  }
  else if (lk=='f')
  {
    freeze=!freeze;
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
    user.stormlight = 100000;
    for (let i = 0; i < 4; i++)
    {
      user.addAnimal();
    }
  }

  $('#name').text("Name: " + user.name);
}

function handlePushedAnimalUpdate(data)
{
  if (data["username"] == user.name)
  {
    for (let an in user[data["type"]])
    {
      if (user[data["type"]][an].id == data["id"])
      {
        for (let trait in data["updates"])
        {
          user[data["type"]][an][trait] = data["updates"][trait];
        }
        return true;
      }
    }
  }
  return false;
}

function handlePredatorKilled(alldata)
{
  let data=alldata["animal"];
  if (data["username"] == user.name)
  {
    for (let an in user[data["type"]])
    {
      if (user[data["type"]][an].id == data["id"])
      {
        user.triggerReward(100);// send later
        user[data["type"]][an].getBoosted();
        return true;
      }
    }
  }
  return false;
}
