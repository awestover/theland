let quests = {
    "predatorsKilled": [1, 5, 25, 125],
    "personalsKilled": [5, 25, 125, 625],
    "preysKilled": [5, 25, 125, 625]
    // "userAnimalsKilled": [25, 125, 625, 3125],
    // "maxStormlightHeld": [500, 1000, 2500, 10000],
    // "maxScore": [100, 200, 300, 400],
    // "maxNumAnimals": [10, 15, 20, 30]
};

let Qtypes = ["predatorsKilled", "personalsKilled", "preysKilled",
  "userAnimalsKilled", "maxStormlightHeld", "maxScore", "maxNumAnimals"];

// add this later, nicer user view of quests
let QtypesUsrView = ["predators killed", "personals killed", "preys killed",
  "user animals killed", "max Stormlight Held", "max score", "max number of animals"];

function getQuest(quest)
{
  let ps = quest.replace("'", "").replace('"', "").split(": ");
  let t = ps[0];
  let n = parseInt(ps[1]);

  return [t, n];
}

function nextQuest(quest)
{
  if (quest == "none")
  {
    return (Qtypes[0] + ": " + quests[Qtypes[0]][0]);
  }
  try {
    let res = getQuest(quest);
    let t = res[0]; let n = res[1];
    let cDepth = quests[t].indexOf(n);
    let idx = (Qtypes.indexOf(t)+1) % Qtypes.length;
    if (idx == 0) {
      cDepth += 1;
    }
    return (Qtypes[idx] + ": " + quests[Qtypes[idx]][cDepth]);
  }
  catch (e) {
    console.log("Out of quests? or some misc error...");
    console.log(e);
    return "no more quests";
  }
}

function questComplete()
{
  if (userDb["quest"] == "none") {
    return true;
  }
  let res = getQuest(userDb["quest"]);
  // console.log(res);
  if (userDb[res[0].toLowerCase()] >= res[1])
  {
    return true;
  }
  return false;
}

function getCamel(uncammeled)
{
  for (let q in Qtypes)
  {
    if (Qtypes[q].toLowerCase() == uncammeled)
    {
      return Qtypes[q];
    }
  }
  return false;
}

function getTitle(lvl)
{
  if(lvl == 0)
  {
    return "none";
  }
  if (lvl == 1)
  {
    return "beginner";
  }
  else if(lvl == 2)
  {
    return "sketchy";
  }
  else if (lvl == 3)
  {
    return "artist";
  }
  else if (lvl < 6)
  {
    return "glider";
  }
  else if (lvl == 6)
  {
    return "pro";
  }
  else if (lvl < 50) {
    return "lander"
  }
  else {
    return "hacker";
  }
}
