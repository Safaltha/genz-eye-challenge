// =================================
// 🦅 EAGLE RADAR
// COMPLETE VERSION + SOUND + MISSIONS
// PART 1
// =================================


const gameArea = document.getElementById("gameArea");
const target = document.getElementById("target");

const scoreText = document.getElementById("score");
const levelText = document.getElementById("level");
const livesText = document.getElementById("lives");
const coinsText = document.getElementById("coins");
const comboText = document.getElementById("combo");

const message = document.getElementById("message");
const progressBar = document.getElementById("progressBar");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const soundBtn = document.getElementById("soundBtn");


// GAME DATA

let score = 0;
let level = 1;
let lives = 3;
let coins = 0;
let combo = 0;

let playing = false;
let paused = false;

let gameSound = true;

let targetTimer;
let countdownTimer;

let targetTime = 1500;
let time = 20;


// UPDATE SCREEN

function updateUI(){

scoreText.innerHTML = score;
levelText.innerHTML = level;
livesText.innerHTML = lives;
coinsText.innerHTML = coins;
comboText.innerHTML = combo;

progressBar.style.width =
Math.min(level * 10,100)+"%";

}
