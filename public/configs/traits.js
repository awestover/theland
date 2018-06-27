let default_personal_stats =
{
  "sickPr": 0,
  "health": 10,
  "rebirthPr": 0.0005,
  "strength": 1,
  "speed": 4,
  "levelUpPr": 0.0005,
  "deadHunger": 5,
  "dHunger": 0.009,
  "dAge": 0.005
};

let personals_traits_deltas =
{
  "bear":
  [
    "Very high tolerance for hunger. Very high strength, Lower rebirth and level up rates",
    {
      "rebirthPr": -0.0003,
      "strength": +2,
      "levelUpPr": -0.0003,
      "deadHunger": +10
    }
  ],

  "butterfly":
  [
    "Pretty average. Most well balanced.",
    {

    }
  ],

  "crab":
  [
    "Very healthy. A lot hungrier and slower.",
    {
      "health": +15,
      "dHunger": +0.011,
      "speed": -1
    }
  ],

  "dog":
  [
    "Reproduces a lot. Lower health. Higher hunger.",
    {
      "health": -5,
      "rebirthPr": 0.0015,
      "dHunger": 0.001,
      "deadHunger": -1
    }
  ],

  "shark":
  [
    "Very fast. More likely to upgrade. Lower reproduction. Lower health.",
    {
      "health": -2,
      "levelUpPr": +0.001,
      "rebirthPr": -0.0005,
      "speed": +3
    }
  ],

  "squid":
  [
    "Very low hunger and age needs. Slight probability of spontaneous death.",
    {
      "sickPr": 0.001,
      "dHunger": -0.009,
      "dAge": -0.005
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
