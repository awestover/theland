let quests = {
    "predatorsKilled": [1, 5, 25, 125],
    "personalsKilled": [5, 25, 125, 625],
    "preysKilled": [5, 25, 125, 625],
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
  let ps = quest.split(": ");
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
  console.log(userDb[quests[res[0]]]);
  console.log(res);
  if (userDb[quests[res[0]].toLowerCase()] >= res[1])
  {
    return true;
  }
  return false;
}
