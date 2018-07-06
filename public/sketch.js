/* Main user interaction
Alek Westover
theland.herokuapp.com
*/

let myp5 = new p5(function(sketch) {

let user;
sketch.setup = function()
{

  for (let i in thColors)
  {
    thColors[i] = sketch.color(thColors[i]);
  }
  for (let i in personalBarColors)
  {
    personalBarColors[i] = sketch.color(personalBarColors[i]);
  }

  screen_dims = [sketch.windowWidth, sketch.windowHeight*0.9];
  canvas = sketch.createCanvas(screen_dims[0], screen_dims[1]);
  sketch.textAlign(sketch.CENTER);
  sketch.frameRate(10);

  let userValues = parseURL(document.URL);

  if (userValues["verified"] == "yes")
  {
    $.notify('Welcome back', {style: 'notification'});
  }

  if (userValues.accelerometerWanted == "on")
  {
    accelerometerWanted = true;
  }

  if (userValues.soundWanted == "on")
  {
    soundWanted = true;
    if (soundWanted) {
      song = sketch.loadSound("pictures/song.m4a", songLoaded);
    }
  }
  else {
    soundWanted = false;
  }

  socket = io.connect();
  socket.on("updatePlayer", sketch.handleUpdatePlayer);
  socket.on("deletePlayer", handleDeletePlayer);
  socket.on('nameChosen', sketch.handleNameChosen);
  socket.on('worldChosen', sketch.handleWorldChosen);
  socket.on('pushedAnimalUpdate', sketch.handlePushedAnimalUpdate);
  socket.on('death', sketch.handleDeath);
  socket.on('selectedData', sketch.handleSelectedData);
  if (userValues["chatWanted"]=="on")
  {
    socket.on('textIncoming', handleTextIncoming);
  }
  socket.on('gotOccupied', function(data) {
    if (data.killth == user.th)
    {
      $.notify("You got occupied", {"style": "occupation"});
      user.stormlight = 0;
    }
  });

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

  adjustSize(getGridSize({})); // just default
  for (let th = 0; th < 12; th++)
  {
    territoryLocs[th] = calculateTerritory(th);
  }
  gametree = new Gametree();

  if (userValues.verified == "yes")
  {
    socket.emit("selectDb", {"unm": name});
  }

  zoom = sketch.createSlider(0.2, 5, 1, 0);// min, max, init, step
	zoom.style("width", "300px");
  zoom.position(200, 200);

}

sketch.draw = function()
{
  sketch.scale(zoom.value());

  // graphics basis
  sketch.background(bgColor);
  sketch.translate(screen_dims[0]/2, screen_dims[1]/2);  // center to 0,0

  sketch.text("Z:"+Math.floor(angles[2])+ " Y:"+Math.floor(angles[1]), 0, -10);

  // show major elements and get ready to check for collisions
  sketch.push();
  sketch.translate(user.pos[0], user.pos[1]);
  user.show(sketch);

  gametree.clear();
  gametree.insertUser(user);

  for (let key in otherUsers)
  {
    otherUsers[key].show(sketch);
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
      drawTerritory(user.th, user.name, sketch);
    }
    else if (thNames[cth])
    {
      drawTerritory(cth, thNames[cth], sketch);
    }
    else {
      drawTerritory(cth, "unclaimed", sketch);
    }
  }

  // look at collisions
  let collisions = gametree.getCollisions();
  for (let c = 0; c<collisions.length; c++)
  {
    sketch.noFill();
    let gcs = [gametree.get(collisions[c][0]), gametree.get(collisions[c][1])];
    if (cheats)
    {
      dRect(gcs[0].getBox(), sketch);
      dRect(gcs[1].getBox(), sketch);
    }
    gcs[0].handleCollide(gcs[1], sketch);
    gcs[1].handleCollide(gcs[0], sketch);
  }

  let tCollisions = gametree.getTerritoryCollisions()
  let gotOccupied = user.getOccupySlots();
  for (let coll in tCollisions)
  {
    let ccollided = gametree.values[tCollisions[coll][0]];
    let ccth = tCollisions[coll][1];
    if (ccollided.type != "personals")
    {
      ccollided.inEnemyTerritory();
    }
    else {
      if (ccollided.th == ccth)
      {
        ccollided.inUserTerritory();
      }
      else {
        ccollided.inEnemyTerritory();
        if (ccollided.th == user.th)
        {
          gotOccupied[ccth] = true;
          if (!user.occupations[ccth])
          {
            user.occupy(ccth);
          }
        }
      }
    }
  }
  for (let go in gotOccupied)
  {
    if (!gotOccupied[go])
    {
      user.cancelOccupy(go);
    }
  }

  let pCollisions = gametree.getPredatorTargets();
  for (let i in pCollisions[0])
  {
    gametree.values[pCollisions[0][i]].pushMotion(pCollisions[1][i], 0);
  }

  drawEdge(sketch); // not allways needed...
  drawOrigin(sketch);

  if (getGridSize(otherUsers) != gridSize)
  {
    adjustSize(getGridSize(otherUsers));
  }

  sketch.pop();

  user.update();
  socket.emit("updatePlayer", user);

  //handle drag
  if (isDown) // handle dragging
  {
    let current_pos = [sketch.mouseX, sketch.mouseY];
    if (onCanvas(current_pos))
    {
      user.updateView(last_down, current_pos);
      last_down = [sketch.mouseX, sketch.mouseY];
    }
    else {
      isDown = false;
    }
  }

  sketch.handleKeysDown();
  if(accelerometerWanted)
  {
    sketch.handleTilted();
  }
  if(scoresVisible)
  {
    showMaxScores(sketch);
  }

  if(gameOver)
  {
    let tmp = textSize();
    textSize(50);
    text("GAME OVER", 0, 0);
    textSize(tmp);
  }
  else {
    if ((user.personals.length == 0 && gameOverPending==false))
    {
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        if (user.personals.length == 0)
        {
          killUser();
        }
      }, 180000);
      gameOverPending = true;
    }
    if (user.stormlight > 100000 || user.personals.length > 100)
    {
      alert("I think you are a cheater. more sofisticated test coming soon")
      killUser();
    }
  }
};

sketch.handleNameChosen = function(data)
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
  $('#nameTxt').text("Name: " + user.name);
};

sketch.handleWorldChosen = function(data)
{
  user.world = data["world"];
  user.th = data["ourTheta"];
  user.giveAnimalsTh();

  user.pos = negateV(territoryLocs[user.th]);
  user.initAnimals(sketch);

  $('#world').text("World: " + user.world);
  bgColor = sketch.color(worldToColor(user.world));
};

sketch.keyPressed = function()
{
  let lk = sketch.key.toLowerCase();
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
      break;
    case 'p':
      zoom.value(zoom.value()+0.05);
      break;
    case 'o':
      zoom.value(zoom.value()-0.05);
      break;
    case 'n': // select next
      let done = false;
      if (user.selectedPersonal)
      {
        user.selectedPersonal.showStats = !user.selectedPersonal.showStats;
        for (let ani in user.personals)
        {
          if (user.personals[ani].id > user.selectedPersonal.id)
          {
            user.selectedPersonal = user.personals[ani];
            user.personals[ani].showStats = !user.personals[ani].showStats;
            done=true;
            break;
          }
        }
      }

      if (!done && user.personals.length > 0)
      {
        user.selectedPersonal = user.personals[0];
        user.selectedPersonal.showStats = !user.selectedPersonal.showStats;
      }

      break;

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
      sketch.annihilate();
    }
    else if(lk=='i') // togle invincibility
    {
      for (let pp in user.personals)
      {
        user.personals[pp].health += 10;
      }
    }
  }
};

sketch.touchEnded = function()
{
  if (event.type == "touchend" || event.type == "mouseup" && (sketch.deviceOrientation == "undefined"))
  {
    let rMPos=realPos([sketch.mouseX, sketch.mouseY], user);
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
};

sketch.handleKeysDown = function() {
  let keyD = 30;
  if (sketch.keyIsDown(sketch.LEFT_ARROW) || sketch.keyIsDown(keyCodes['a'])) {
    user.updateView(user.pos, addV(user.pos, [keyD, 0]));
  }
  else if (sketch.keyIsDown(sketch.RIGHT_ARROW) || sketch.keyIsDown(keyCodes['d'])) {
    user.updateView(user.pos, addV(user.pos, [-keyD, 0]));
  }
  if (sketch.keyIsDown(sketch.UP_ARROW) || sketch.keyIsDown(keyCodes['w'])) {
    user.updateView(user.pos, addV(user.pos, [0, keyD]));
  }
  else if (sketch.keyIsDown(sketch.DOWN_ARROW) || sketch.keyIsDown(keyCodes['s'])) {
    user.updateView(user.pos, addV(user.pos, [0, -keyD]));
  }
};

sketch.handleTilted = function()
{
  let rD = 20;
  let threshold = 10;
  let dvs = [[rD, 0], [-rD, 0], [0, rD], [0, -rD]];
  if (sketch.deviceOrientation == "landscape")
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
};

sketch.touchStarted = function()
{
  last_down = [sketch.mouseX, sketch.mouseY];
  isDown = true;
};

sketch.handleQuestComplete = function()
{
  if (userDb.quest>-1)
  {
    $.notify("Quest complete: " + questText(userDb.quest), {style: 'notification'});
  }
  if (levelUp(userDb.quest))
  {
    userDb.level += 1;
  }
  userDb.quest += 1;
  userDb.title = getTitle(userDb.level);
  socket.emit("updateAchievments", {"unm": user.name, "col": "quest", "newVal": userDb.quest});
  socket.emit("updateAchievments", {"unm": user.name, "col": "level", "newVal": userDb.level});
  socket.emit("updateAchievments", {"unm": user.name, "col": "title", "newVal": userDb.title});

  updateDbText();

  if(questComplete()) // they might already be done with the next quest too...
  {
    sketch.handleQuestCopmlete();
  }
};

sketch.handlePushedAnimalUpdate = function(data)
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
};

sketch.handleDeath = function(alldata)
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
          console.log("triggered");
          user.triggerReward(alldata["type"]);
          return true;
        }
      }
    }
  }
  return false;
};

sketch.handleUpdatePlayer = function(otherUser)
{
  for (let i = 0; i < otherUser.personals.length; i++)
  {
    otherUser.personals[i] = new Personal(otherUser.personals[i], sketch);
  }
  for (let i = 0; i < otherUser.preys.length; i++)
  {
    otherUser.preys[i] = new Prey(otherUser.preys[i], sketch);
  }
  for (let i = 0; i < otherUser.predators.length; i++)
  {
    otherUser.predators[i] = new Predator(otherUser.predators[i], sketch);
  }
  for (let i = 0; i < otherUser.protectors.length; i++)
  {
    otherUser.protectors[i] = new Protector(otherUser.protectors[i], sketch);
  }
  otherUsers[otherUser.name] = new User(otherUser);
};

sketch.handleSelectedData = function(data)
{
  userDb = data[0];
  if (questComplete()) {
    sketch.handleQuestCopmlete();
  }
  else {
    updateDbText();
  }
};

sketch.feedHungry = function()
{
  user.feedHungry();
};
sketch.upgradeSelected = function()
{
  user.upgradeSelected();
};
sketch.toggleAttractAnimals = function()
{
  user.toggleAttractAnimals();
};
sketch.toggleStatsAll = function()
{
  user.toggleStatsAll();
};
sketch.buyAnimal = function()
{
  user.buyAnimal();
};
sketch.buyProtector = function()
{
  user.buyProtector();
};

sketch.annihilate = function()
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
};

sketch.sendText = function(txt)
{
  data = {
    "world": user.world,
    "txt": txt + " - " + user.name
  }
  $.notify(data["txt"], {style: 'message'});
  socket.emit("textSent", data);
};

});

function killUser()
{
  gameOver = true;
  setTimeout(function(){window.location.href="index.html";}, 3000);
};

function stopGameOverCallback()
{
  clearTimeout(timeout);
  gameOverPending = false;
};

function handleDeletePlayer(data)
{
  console.log("deleting " + data["name"]);
  delete otherUsers[data["name"]];
  // splice(x, 1) to remove element
};

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
