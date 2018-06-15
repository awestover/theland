let questsOrdered = [
   ["preys_killed", 1  ],
  // ["preys_killed", 1  ], ["predators_killed", 1  ], ["personals_killed", 1  ],
  // ["preys_killed", 10 ], ["predators_killed", 5  ], ["personals_killed", 7 ],
  // ["preys_killed", 20 ], ["predators_killed", 10 ], ["personals_killed", 14 ],
  // ["preys_killed", 40 ], ["predators_killed", 20 ], ["personals_killed", 28 ],
  // ["preys_killed", 80 ], ["predators_killed", 40 ], ["personals_killed", 56 ],
  // ["preys_killed", 160], ["predators_killed", 80 ], ["personals_killed", 112],
  // ["preys_killed", 320], ["predators_killed", 160], ["personals_killed", 224],
  // ["preys_killed", 640], ["predators_killed", 320], ["personals_killed", 448],
  ["No more quests", -1]
];

let Qtypes = ["predators_killed", "personals_killed", "preys_killed"];

function levelUp(quest)
{
  // level up every 3 quests
  return ((quest+1)%3 == 0);
}

function questComplete()
{
  if (userDb["quest"] == -1) {
    return true;
  }
  else if(userDb["quest"] >= questsOrdered.length)
  {
    return false;
  }
  else {
    let res = questsOrdered[userDb["quest"]];
    return (userDb[res[0]] >= res[1]);
  }
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
