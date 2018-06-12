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

  for (let i in thColors)
  {
    thColors[i] = color(thColors[i]);
  }

  screen_dims = [windowWidth, windowHeight*0.9];
  canvas = createCanvas(screen_dims[0], screen_dims[1]);
  textAlign(CENTER);
  frameRate(10);

  let userValues = parseURL(document.URL);

  if (userValues["verified"] == "yes")
  {
    alert("WELCOME BACK!!!!!");
  }

  if (userValues.soundWanted == "on")
  {
    soundWanted = true;
    if (soundWanted) {
      song = loadSound("pictures/song.m4a", songLoaded);
    }
  }
  else {
    soundWanted = false;
  }

  socket = io.connect();
  socket.on("updatePlayer", handleUpdatePlayer);
  socket.on("deletePlayer", handleDeletePlayer);
  socket.on('nameChosen', handleNameChosen);
  socket.on('worldChosen', handleWorldChosen);
  socket.on('pushedAnimalUpdate', handlePushedAnimalUpdate);
  socket.on('death', handleDeath);
  socket.on('selectedData', handleSelectedData);

  let animalType = userValues["anType"];
  let atIdx = animal_names["personals"].indexOf(animalType.toLowerCase());
  if (atIdx != -1)
  {
    animalType = atIdx;
  }
  animalType = parseInt(animalType);
  if (isNaN(animalType) || animalType < 0 || animalType >= animal_names["personals"].length)
  {
    animalType = pickRandom(animal_names["personals"])[0];
  }
  else {
    animalType = animal_names["personals"][animalType];
  }
  user = new User({"animal_type": animalType});
  // let name = prompt("Name");
  let name = userValues["unm"];
  socket.emit("named", {"name":name});
  // let world=prompt("World");
  let world = userValues["world"];
  socket.emit("sendWorld", {"world":world});

  user.setAnimalType();
  socket.emit('choseAnimalType', {"animalType": animalType});

  user.initAnimals();

  edgeRects = calculateEdge();
  for (let th = 0; th < 12; th++)
  {
    territoryLocs[th] = calculateTerritory(th);
  }
  gametree = new Gametree();

  if (userValues.verified == "yes")
  {
    socket.emit("selectDb", {"unm": name});
  }

}

function draw()
{
  // graphics basis
  background(bgColor[0], bgColor[1], bgColor[2]);
  translate(screen_dims[0]/2, screen_dims[1]/2);  // center to 0,0

  text("Z:"+Math.floor(angles[2])+ " Y:"+Math.floor(angles[1]), 0, -10);

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
    if (cheats)
    {
      dRect(gcs[0].getBox());
      dRect(gcs[1].getBox());
    }
    gcs[0].handleCollide(gcs[1]);
    gcs[1].handleCollide(gcs[0]);
  }

  let tCollisions = gametree.getTerritoryCollisions()
  for (let coll in tCollisions)
  {
    let ccollided = gametree.values[tCollisions[coll][0]];
    let ccth = tCollisions[coll][1];
    if (ccollided.th == ccth)
    {
      ccollided.inUserTerritory();
    }
    else {
      ccollided.inEnemyTerritory();
    }
  }

  let pCollisions = gametree.getPredatorTargets();
  for (let i in pCollisions[0])
  {
    gametree.values[pCollisions[0][i]].pushMotion(pCollisions[1][i], 0);
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
  handleTilted();
  if(scoresVisible)
  {
    showMaxScores();
  }

  // drawCenterCross();

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

function handleSelectedData(data)
{
  userDb = data[0];
  if (questComplete()) {
    handleQuestCopmlete();
  }
  else {
    updateDbText();
  }
}

function updateDbText()
{
  $("#stats").text(userDbToTxt());

  $("#level").text("Level: " + userDb["level"]);
  $("#quest").text("Quest: " + userDb["quest"]);
}

function handleQuestCopmlete()
{
  userDb["quest"] = nextQuest(userDb["quest"]);
  userDb["level"] += 1;
  socket.emit("updateAchievments", {"unm": user.name, "col": "quest", "newVal": "'"+userDb["quest"]+"'"});
  socket.emit("updateAchievments", {"unm": user.name, "col": "level", "newVal": userDb["level"]});

  updateDbText();
}

function touchEnded()
{
  if (event.type == "touchend" || event.type == "mouseup" && (deviceOrientation == "undefined"))
  {
    let rMPos=realPos([mouseX, mouseY]);
    let collisions = gametree.getCollisionsWith([rMPos[0], rMPos[1], 5, 5])
    if (collisions.length > 0)
    {
      let cidx = 0;
      let idx = collisions[cidx];
      if (gametree.values[idx].username == user.name && gametree.values[idx].type == "personals")
      {
        user.selectedPersonal = gametree.values[idx];
        gametree.values[idx].showStats = !gametree.values[idx].showStats;
      }
    }
    isDown = false;
  }
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

function handleTilted()
{
  let rD = 20;
  let threshold = 10;
  let dvs = [[rD, 0], [-rD, 0], [0, rD], [0, -rD]];
  if (deviceOrientation == "landscape")
  {
      dvs = [[0, -rD], [0, rD], [rD, 0], [-rD, 0]];
  }

  if (angles[2] < -threshold)
  {
    user.updateView(user.pos, addV(user.pos, dvs[0]));
  }
  else if (angles[2] > threshold)
  {
    user.updateView(user.pos, addV(user.pos, dvs[1]));
  }
  if (angles[1] < -threshold)
  {
    user.updateView(user.pos, addV(user.pos, dvs[2]));
  }
  else if (angles[1] > threshold)
  {
    user.updateView(user.pos, addV(user.pos, dvs[3]));
  }
}

// accelerometer Data
window.addEventListener('deviceorientation', function(e)
{
  angles[0] = e.alpha;
  angles[1] = e.beta;
  angles[2] = e.gamma;
  for (let i = 0; i < 3; i++)
  {
    if (!angles[i])
    {
      angles[i]=0;
    }
  }
});

function keyPressed()
{
  let lk = key.toLowerCase();
  switch(lk)
  {
    case 'b':
      user.buyAnimal();
      break;
    case 't':
      user.toggleAttractAnimals();
      break;
    case 'c':
      toggleScores();
      break;
    case 'f':
      user.feedHungry();
      break;
    case 'u':
      user.upgradeSelected();
      break;
    case 'g':
      user.toggleStatsAll();
  }
  if (cheats)
  {
    if (lk=='l')
    {
      user.stormlight+=100;
    }
    else if (lk=='r')
    {
      freeze=!freeze;
    }
    else if (lk=='h')
    {
      annihilate();
    }
  }
}

function handleWorldChosen(data)
{
  user.world = data["world"];
  user.th = data["ourTheta"];
  user.giveAnimalsTh();
  // user.pos = negateV(territoryLocs[user.th]);
  $('#world').text("World: " + user.world);

  bgColor = worldToColor(user.world);
}

function handleNameChosen(data)
{
  user.name = data;
  user.giveAnimalsName();
  if (validate(user.name) == "gold and power")
  {
    cheats = true;
    user.stormlight = 100000;
  }
  else if (validate(user.name) == "power")
  {
    cheats = true;
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

function handleDeath(alldata)
{
  let data = alldata["animal"];
  if (data["username"] == user.name)
  {
    if (data["type"] == "personals")
    {
      for (let an in user[data["type"]])
      {
        if (user[data["type"]][an].id == data["id"])
        {
          user.triggerReward(alldata["type"]);
          return true;
        }
      }
    }
  }
  return false;
}

function encrypt(pwd)
{
  let o = 1;
  for(let i = 0; i < pwd.length; i++)
  {
    o *= pwd.charCodeAt(i);
    o = o % 7907;
  }
  return o;
}

function validate(pwd)
{
  if (encrypt(pwd) == 6769)
  {
    return "gold and power";
  }
  else if (encrypt(pwd) == 3845)
  {
    return "power";
  }
  return false;
}

function annihilate()
{
  for (let gt in gametree.values)
  {
    let data = {
      "world": user.world,
      "username": gametree.values[gt].username,
      "type": gametree.values[gt].type,
      "id": gametree.values[gt].id,
      "updates":{"health": -10000}// because with aging 0 isn't good enough
    }
    socket.emit("pushAnimalUpdate", data);
  }
}
