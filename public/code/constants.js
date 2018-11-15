//constants
const allAnimals = ["personals", "preys", "predators", "protectors"];

// all animal names
let animal_names = {};
animal_names["personals"] = ["squirrel","fly","sheep", "squid", "narwhal", "dog", "shark",
  "bear", "crab", "butterfly", "dragon", "crab-original", "shark-original", "squid-original"];
animal_names["preys"] = ["pizza", "cake", "chicken", "hawaiianPizza", "pie"];
animal_names["predators"] = ["dino"];
animal_names["protectors"] = ["balrog"];
let animal_txt_help = "";
for (let i = 0; i < animal_names["personals"].length; i++){
  animal_txt_help += animal_names["personals"][i] + "(" + i + ")" + "\n";
}

let personalNameIndxes = [];
for (let i = 0; i < animal_names["personals"].length; i++)
{
  personalNameIndxes.push(i);
}

let animated = {};
for (var i = 0; i < allAnimals.length; i++) {
  for (var j = 0; j < animal_names[allAnimals[i]].length; j++) {
    animated[animal_names[allAnimals[i]][j]] = {"animated":false};
  }
}
animated['squirrel'] = {"animated": true, "frames": 3, "frameOrder": [0,1,2,2,1,0]};
animated['fly'] = {"animated": true, "frames": 5, "frameOrder": [0,1,2,3,4,4,3,2,1,0]};

let bgColor = [2, 124, 57];
let angles = [0,0,0];
let cheats = false;

const rewards  = {"predators": 200, "personals": 60, "preys": 20, "protectors":300};
// note level 0 is reserved for boosted state...
const max_lvls = {"personals": 4, "predators": 1, "preys": 1, "protectors": 1};
let animal_pictures = {};

const keyCodes = {"a":65, "d": 68, "s": 83, "w": 87};
const numTerritories = 12;
const boundSize  = 100;
const territoryR = 100;
let gridSize, bounds, edgeRects;
let territoryLocs = [];
let scoresVisible = false;
const scoreWidth = 120;
const numHighscores = 3;

// testing purposes
let freeze=false;

let socket;
let screen_dims;
let canvas;

let last_down = [0, 0];
let isDown = false;

let otherUsers = {};
let gametree;
let quadtree;

// not really a limit, they can still reproduce over this you just can't buy any more after 10
const maxAnimals = 10;
const maxProtectors = 2;

// convert to color objects in setup
//https://sashat.me/2017/01/11/list-of-20-simple-distinct-colors/
let thColors = [[0, 130, 200],
  [230, 25, 75],   [60, 180, 75],  [128, 128, 0],
  [245, 130, 48],  [255, 225, 25], [145, 30, 180],
  [70, 240, 240],  [240, 50, 230], [210, 245, 60],
  [250, 190, 190], [230, 190, 255]]; //[0, 128, 128],

let personalBarColors = [[66, 134, 244],
  [82, 232, 55],
  [224, 206, 13],
  [205, 15, 226]];

const barHeight = 5;

let soundWanted = false;
let song;

let userDb;

let gameOver = false;

$.notify.addStyle('message', {
  html: "<div><span data-notify-text/></div>",
  classes: {
    base: {
      "white-space": "nowrap",
      "background-color": "lightblue",
      "padding": "20px",
      "width": "300px"
    }
  }
});

$.notify.addStyle('notification', {
  html: "<div><span data-notify-text/></div>",
  classes: {
    base: {
      "white-space": "nowrap",
      "background-color": "white",
      "padding": "20px",
      "width": "300px"
    }
  }
});

$.notify.addStyle('occupation', {
  html: "<div><span data-notify-text/></div>",
  classes: {
    base: {
      "white-space": "nowrap",
      "background-color": "red",
      "padding": "20px",
      "width": "300px"
    }
  }
});

let zoom;
let timeout;
let gameOverPending = false;
let accelerometerWanted = false;
