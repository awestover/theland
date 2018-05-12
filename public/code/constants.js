//constants

// all animal names
const animal_names = ["dog", "shark", "bear", "crab"];
let animal_txt_help = "Please chose an animal. Your choices include:\n";
for (let i = 0; i < animal_names.length; i++){
  animal_txt_help += animal_names[i] + "(" + i + ")" + "\n";
}
const max_lvl = 2;
let animal_pictures = {};

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
