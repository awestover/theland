let default_personal_stats =
{
  "sickPr": 0,
  "health": 10,
  "rebirthPr": 0.002,
  "strength": 1,
  "speed": 4,
  "levelUpPr": 0.0005,
  "deadHunger": 5,
  "dHunger": 0.018,
  "dAge": 0.01
};

let personals_traits_deltas =
{
  "bear":
  [
    "Very high tolerance for hunger. Very high strength, Lower rebirth and level up rates",
    {
      "rebirthPr": -0.001,
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
      "dHunger": 0.03,
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
      "health": -1,
      "levelUpPr": +0.0005,
      "rebirthPr": -0.0005,
      "speed": +2
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
  }
};

let predator_stats =
{
  "dino":
  {
    "power": 1,
    "speed": 3.2
  }
}
