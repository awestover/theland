//constants

// all animal names
const personal_names = ["dog", "shark", "bear", "crab"];
const prey_names = ["pizza"];
const predator_names = ["dino"];
let animal_txt_help = "Please chose an animal. Your choices include:\n";
for (let i = 0; i < personal_names.length; i++){
  animal_txt_help += personal_names[i] + "(" + i + ")" + "\n";
}
let animal_names = [];
for (let pn in personal_names)
{
  animal_names.push(personal_names[pn]);
}
for(let pn in prey_names)
{
  animal_names.push(prey_names[pn]);
}
for (let pn in predator_names)
{
  animal_names.push(predator_names[pn]);
}

const rewards = {"predators":2, "personals": 1, "preys": 0};

const max_lvls = {"personals": 4, "preys": 1, "predators": 1};
let animal_pictures = {};
const allAnimals = ["personals", "preys", "predators"];

const keyCodes = {"a":65, "d": 68, "s": 83, "w": 87};
const gridSize   = 1000; //2500
const boundSize  = 100;
const territoryR = 300; //500
const bounds = [[-gridSize, gridSize], [-gridSize, gridSize]];
let edgeRects = [];
let territoryLocs = [];
let scoresVisible = true;
const numHighscores = 5;

let socket;
let user;
let screen_dims;
let canvas;

let last_down = [0, 0];
let isDown = false;

let otherUsers = {};
let gametree;

let all_foods = []; // somehow food is associated with user but not really...
