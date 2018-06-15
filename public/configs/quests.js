let questsOrdered = [
  ["preys_killed", 1  ], ["predators_killed", 1  ], ["personals_killed", 1  ],
  ["preys_killed", 10 ], ["predators_killed", 5  ], ["personals_killed", 10 ],
  ["preys_killed", 20 ], ["predators_killed", 10 ], ["personals_killed", 20 ],
  ["preys_killed", 40 ], ["predators_killed", 20 ], ["personals_killed", 40 ],
  ["preys_killed", 80 ], ["predators_killed", 40 ], ["personals_killed", 80 ],
  ["preys_killed", 160], ["predators_killed", 80 ], ["personals_killed", 160],
  ["preys_killed", 320], ["predators_killed", 160], ["personals_killed", 320],
  ["preys_killed", 640], ["predators_killed", 320], ["personals_killed", 640]
];

let Qtypes = ["predators_killed", "personals_killed", "preys_killed"];

function questComplete()
{
  if (userDb["quest"] == -1) {
    return true;
  }
  let res = questsOrdered[userDb["quest"]];
  if (userDb[res[0]] >= res[1])
  {
    return true;
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
  else if (lvl < 9)
  {
    return "swimmer";
  }
  else if (lvl < 9)
  {
    return "prancer";
  }
  else if (lvl < 50) {
    return "lander"
  }
  else {
    return "hacker";
  }
}
