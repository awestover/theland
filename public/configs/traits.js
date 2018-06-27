let default_personal_stats =
{
  "sickPr": 0,
  "health": 10,
  "rebirthPr": 0.0005,
  "strength": 1,
  "speed": 4,
  "levelUpPr": 0.0005,
  "deadHunger": 5,
  "dHunger": 0.011,
  "dAge": 0.005
};

let personals_traits_deltas =
{
  "bear":
  [
    "Very high tolerance for hunger. Very high strength, Lower rebirth and level up rates. " +
    "The bear is a deadly foe and a friend who may outlast all enemies, except perhaps the squid",
    {
      "rebirthPr": -0.0003,
      "strength": +2,
      "levelUpPr": -0.0003,
      "deadHunger": +7
    }
  ],

  "butterfly":
  [
    "Pretty average. Most well balanced. " +
    "The butterfly is like the set of values less than 0.1 standard deviations away from the mean in a bell curve. " +
    "Balance is nice in life, but is it so in the intense land known as theland? The butterfly screams yes.",
    {

    }
  ],

  "crab":
  [
    "Very healthy. A lot hungrier and slower. "+
    "The crab. Not much to say. Pretty much this animal is a bomb. Put it somewhere and it will eat it. Or die trying.",
    {
      "health": +15,
      "dHunger": +0.011,
      "speed": -1
    }
  ],

  "dog":
  [
    "Reproduces a lot. Lower health. Higher hunger. "+
    "It is actually a sheep. Yeah. Pretty much. The dog is an incredibly cunning and deceptive creature and "+
    "that is why it has a pseudonym. Or so the sheep wants you to believe.",
    {
      "health": -5,
      "rebirthPr": 0.0015,
      "dHunger": 0.001,
      "deadHunger": -1
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
      "speed": +3
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
      "dAge": -0.005
    }
  ],

  "narwhal":
  [
    "Incredibly high speed coupled with incredibly high hunger. "+
    "Narwhals are not cool. They are warm hopefully. They are just about as real as arcsin(pi) if you resonate with my frequency of data transmission. " +
    "They transced common things like that. Or something.",
    {
      "speed": +8,
      "dHunger": +0.03
    }
  ]

};

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

let prey_descriptions = {
  "pizza":"pretty good food, health and hunger",
  "cake":"really good food",
  "chicken":"only helps with hunger"
};
let prey_stats = {
  "pizza":
  {
    "health": 10,
    "help": {"health": 1, "hunger": -0.5}
  },
  "cake":
  {
    "health": 20,
    "help": {"health": 2, "hunger": -1}
  },
  "chicken":
  {
    "health": 300,
    "help": {"health": 0, "hunger": -0.25}
  }
};

let predator_descriptions = {
  "dino": "only predator type for now, and therefore the strongest type of predator. \
  Note there is large variablility in sight radii and health for dinos"
};
let predator_stats =
{
  "dino":
  {
    "power": 1,
    "speed": 3.2
  }
};

const allDescriptions =  {
  "personals": personal_descriptions,
  "preys":prey_descriptions,
  "predators":predator_descriptions
};

const allStats =
{
  "personals": personal_stats,
  "preys":prey_stats,
  "predators":predator_stats
};
