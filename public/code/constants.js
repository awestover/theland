//constants
const allAnimals = ["personals", "preys", "predators"];

// all animal names
let animal_names = {};
animal_names["personals"] = ["dog", "shark", "bear", "crab"];
animal_names["preys"] = ["pizza"];
animal_names["predators"] = ["dino"];
let animal_txt_help = "Please chose an animal. Your choices include:\n";
for (let i = 0; i < animal_names["personals"].length; i++){
  animal_txt_help += animal_names["personals"][i] + "(" + i + ")" + "\n";
}

const rewards  = {"predators": 300, "personals": 30, "preys": 0};
// note level 0 is reserved for boosted state...
const max_lvls = {"personals": 4, "predators": 1, "preys": 1};
let animal_pictures = {};

const keyCodes = {"a":65, "d": 68, "s": 83, "w": 87};
const numTerritories = 12;
const gridSize   = 1500; //2500
const boundSize  = 100;
const territoryR = 225; //500
const bounds = [[-gridSize, gridSize], [-gridSize, gridSize]];
let edgeRects = [];
let territoryLocs = [];
let scoresVisible = true;
const numHighscores = 3;

// testing purposes
let freeze=false;

let socket;
let user;
let screen_dims;
let canvas;

let last_down = [0, 0];
let isDown = false;

let otherUsers = {};
let gametree;
