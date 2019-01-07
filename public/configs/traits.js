let default_personal_stats =
{
  "sickPr": 0,
  "health": 10,
  "rebirthPr": 0.0005,
  "strength": 1,
  "speed": 4,
  "levelUpPr": 0.0005,
  "deadHunger": 5,
  "dHunger": 0.006,
  "dAge": 0.002
};

let personals_traits_deltas =
{
  "rooster":
  [
    "moooooooooooooo",
    {
      "speed": 2,
      "health": 4,
      "strength": 1,
      "dAge": -0.001
    }
  ],
  "squirrel":
  [
    "This is a squirrel. You better watch out, it is pretty much the best animal in game.",
    {
      "speed": 10
    }
  ],
  "fly":
  [
    "just pretend like its a fly... It totally is a fly, it is just hard to tell. Whatever you do don't call it a shark though, that would be insulting.",
    {
      "speed": 6
    }
  ],
  "sheep":
  [
    "The sheep. This is that one sheep that got lost. Not sure if anyone found it yet.",
    {
      "levelUpPr": +0.006,
      "speed": +2,
      "health": +5,
      "deadHunger": +5,
      "dims": [66, 50]
    }
  ],
  "bear":
  [
    "Very high tolerance for hunger. Very high strength, Lower rebirth and level up rates. " +
    "The bear is a deadly foe and a friend who may outlast all enemies, except perhaps the squid",
    {
      "rebirthPr": -0.0003,
      "strength": +2,
      "levelUpPr": -0.0003,
      "deadHunger": +7,
      "dims": [66, 50]
    }
  ],

  "butterfly":
  [
    "Pretty average. Most well balanced. " +
    "The butterfly is like the set of values less than 0.1 standard deviations away from the mean in a bell curve. " +
    "Balance is nice in life, but is it so in the intense land known as theland? The butterfly screams yes.",
    {
      "dims": [66, 50]
    }
  ],

  "crab":
  [
    "Very healthy. A lot hungrier and slower. "+
    "The crab. Not much to say. Pretty much this animal is a bomb. Put it somewhere and it will eat it. Or die trying.",
    {
      "health": +15,
      "dHunger": +0.011,
      "speed": -1,
      "dims": [66, 50]
    }
  ],

  "dog":
  [
    "Reproduces a lot. Lower health. Higher hunger. "+
    "It is actually a sheep. Yeah. Pretty much. The dog is an incredibly cunning and deceptive creature and "+
    "that is why it has a pseudonym. Or so the sheep wants you to believe.",
    {
      "health": -5,
      "rebirthPr": 0.000015,
      "dHunger": 0.001,
      "deadHunger": -1,
      "dims": [66, 50]
    }
  ],

  "shark":
  [
    "Very fast. More likely to upgrade. Lower reproduction. Lower health. "+
    "One day the shark dreams of travelling to theland beyond thewall. This is obviously "+
    "quite futile as it would mean instant death. But maybe that is part of the plan just like a wise talking mouse once thought.",
    {
      "health": -2,
      "levelUpPr": +0.001,
      "rebirthPr": -0.0005,
      "speed": +3,
      "dims": [90, 50]
    }
  ],

  "squid":
  [
    "Very low hunger and age needs. Slight probability of spontaneous death. "+
    "The squid usually has a pretty good life. It doesn't worry about much, despite the complete power the dice have "+
    "over it. Let the die be cast.",
    {
      "sickPr": 0.001,
      "dHunger": -0.009,
      "dAge": -0.0019,
      "dims": [54, 70]
    }
  ],

  "narwhal":
  [
    "Incredibly high speed coupled with incredibly high hunger. "+
    "Narwhals are not cool. They are warm hopefully. They are just about as real as arcsin(pi) if you resonate with my frequency of data transmission. " +
    "They transced common things like that. Or something.",
    {
      "speed": +8,
      "dHunger": +0.03,
      "dims": [30, 100]
    }
  ],

  "dragon":
  [
    "The dragon does incredibly high damage. The dragon is actually the grandmother of Smaug. "
    +"Probably. No relation to the Dragon Reborn.",
    {
      "strength": +4,
      "dims": [66, 50]
    }
  ],

  "crab-original":
  [
    "This crab means a lot to me. I can't get rid of it. I tried. It is just too beautiful",
    {

    }
  ],
  "shark-original":
  [
    "One of the oldest inhabitants of theland. People thought a shark couldn't live on theland. But they were clearly wrong.",
    {

    }
  ],
  "squid-original":
  [
    "AKA suicide squid. Just goes to show the incredible genetic diversity in theland. This squid really should have been eliminated via natural selection long ago because of its really bad habit of randomly dying. But it wasn't for some reason.",
    {
      "sickPr": 0.003
    }
  ]
};

for (let i in personals_traits_deltas)
{
  try {
    personals_traits_deltas[i][1]["dims"];
  }
  catch {
    personals_traits_deltas[i][1]["dims"] = [66,50];
  }
}

let personal_stats = {};
let personal_descriptions = {};
for (let i in personals_traits_deltas)
{
  personal_descriptions[i] = personals_traits_deltas[i][0];
  let temp = {};
  for (let j in default_personal_stats)
  {
    if (personals_traits_deltas[i][1][j])
    {
      temp[j] = default_personal_stats[j] + personals_traits_deltas[i][1][j];
    }
    else {
      temp[j] = default_personal_stats[j];
    }
  }
  personal_stats[i] = temp;
};
let personal_displayed_stats = {};
let stat_name_conversions = {
  "sickPr": "sick probability",
  "health": "health",
  "rebirthPr": "rebirth probability",
  "strength": "attack power (strength)",
  "speed": "speed",
  "levelUpPr": "level up probability",
  "deadHunger": "dead hunger",
  "dHunger": "hunger rate",
  "dAge": "aging rate"
};
for (let i in personal_stats)
{
  personal_displayed_stats[i] = {};
  for (let s in personal_stats[i])
  {
    personal_displayed_stats[i][stat_name_conversions[s]] = personal_stats[i][s];
  }
}

let prey_descriptions = {
  "pizza": "pretty good food, health and hunger",
  "cake": "really good food. The strawberry is squashy though.",
  "chicken": "only helps with hunger. Catch it if you can.",
  "hawaiianPizza": "this is actually the best pizza type ever!!!",
  "pie": "this pie was left out overnight and then 王朋吃饭把肚子吃坏了"
};

let prey_stats = {
  "pizza":
  {
    "speed": 0,
    "health": 10,
    "help": {"health": 1, "hunger": -0.5}
  },
  "cake":
  {
    "speed": 0,
    "health": 20,
    "help": {"health": 2, "hunger": -1}
  },
  "chicken":
  {
    "speed": 4,
    "health": 200,
    "help": {"health": 0, "hunger": -0.25}
  },
  "hawaiianPizza":
  {
    "speed": 7,
    "health": 50,
    "help": {"health": 5, "hunger": -0.25}
  },
  "pie":
  {
    "speed": 0,
    "health": 300,
    "help": {"health": -1, "hunger": 0}
  }
};

let predator_descriptions = {
  "dino": "This is the only predator type for now, and therefore the strongest type of predator. The dino takes great pride in that, perhaps unduly so.\
  Note there is large variablility in sight radii and health for dinos"
};
let predator_stats =
{
  "dino":
  {
    "power": 1,
    "speed": 3
  }
};

let protector_descriptions = {
  "balrog": "'storms, I'll do it later im working on it all right!' is how the balrog responds anytime someone asks him about his social life."
};
let protector_stats =
{
  "balrog":
  {
    "power": 2,
    "speed": 4
  }
};

const allDescriptions =  {
  "personals": personal_descriptions,
  "preys": prey_descriptions,
  "predators": predator_descriptions,
  "protectors": protector_descriptions
};

const allStats =
{
  "personals": personal_stats,
  "preys": prey_stats,
  "predators": predator_stats,
  "protectors": protector_stats
};

let prey_displayed_stats = {};
for (let prey in prey_stats){
  prey_displayed_stats[prey] = {};
  for (let stat in prey_stats[prey]){
    prey_displayed_stats[prey][stat] = prey_stats[prey][stat];
  }
  let tmp = prey_displayed_stats[prey]["help"];
  delete prey_displayed_stats[prey]["help"];
  for (let tt in tmp){
    prey_displayed_stats[prey]["help "+tt] = tmp[tt];
  }
}

let allStatsReadable = {
  "personals": personal_displayed_stats,
  "preys": prey_displayed_stats,
  "predators": predator_stats,
  "protectors": protector_stats
};

for (let entityType in allStatsReadable) {
  let stat_values = {};
  let stat_names = {};
  for (var entityName in allStatsReadable[entityType]) {
    for (var stat in allStatsReadable[entityType][entityName]) {
      if (stat_values[stat]) {
        stat_values[stat].push(allStatsReadable[entityType][entityName][stat]);
        stat_names[stat].push(entityName);
      }
      else {
        stat_values[stat] = [allStatsReadable[entityType][entityName][stat]];
        stat_names[stat] = [entityName];
      }
    }
  }

  for (let stat in stat_values) {
    let min = Math.min(...stat_values[stat]);
    let max = Math.max(...stat_values[stat]);
    for(let i in stat_values[stat]){
      if(max == min)
        stat_values[stat][i] = 5;
      else
        stat_values[stat][i] = (1+(stat_values[stat][i]-min)*9/(max-min)).toFixed(2);
    }
  }
  for (var statType in stat_values) {
    for (var i in stat_values[statType]) {
      allStatsReadable[entityType][stat_names[statType][i]][statType] = stat_values[statType][i];
    }
  }
}
