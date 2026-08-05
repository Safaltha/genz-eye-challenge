// ===============================
// 🦅 EAGLE RADAR
// PART 1 - VARIABLES
// ===============================

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

let score = 0;
let level = 1;
let lives = 3;
let coins = 0;
let combo = 0;

let playing = false;
let paused = false;
let sound = true;

let targetX = 0;
let targetY = 0;

let targetVisibleTime = 1500;
let roundTimer;

function updateUI(){

scoreText.innerText = score;
levelText.innerText = level;
livesText.innerText = lives;
coinsText.innerText = coins;
comboText.innerText = combo;

progressBar.style.width = Math.min(level,100) + "%";

}

updateUI();
