// =====================================
// 🎯 CYBER SNIPER CHALLENGE
// PART 1: CORE ENGINE
// =====================================


const arena = document.getElementById("arena");
const target = document.getElementById("target");


const scoreText = document.getElementById("score");
const levelText = document.getElementById("level");
const livesText = document.getElementById("lives");
const comboText = document.getElementById("combo");
const accuracyText = document.getElementById("accuracy");
const coinsText = document.getElementById("coins");

const timeText = document.getElementById("time");
const message = document.getElementById("message");
const modeText = document.getElementById("mode");

const progress = document.getElementById("levelProgress");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");

const resultBox = document.getElementById("resultBox");
const resultTitle = document.getElementById("resultTitle");
const resultText = document.getElementById("resultText");



let score = 0;

let level = 1;

let lives = 3;

let combo = 0;

let coins = 0;

let hits = 0;

let shots = 0;


let time = 30;


let playing = false;

let paused = false;


let gameTimer;

let targetTimer;

let moveTimer;



// Difficulty

let targetSpeed = 1500;

let targetSize = 70;



// =====================================
// UPDATE SCREEN
// =====================================


function updateUI(){


scoreText.innerHTML = score;

levelText.innerHTML = level;

livesText.innerHTML = lives;

comboText.innerHTML = combo;

coinsText.innerHTML = coins;


let accuracy = shots === 0 ? 100 :
Math.floor((hits/shots)*100);


accuracyText.innerHTML = accuracy+"%";


progress.style.width =
(level%100)+"%";


}




// =====================================
// RESET GAME
// =====================================


function resetGame(){


score = 0;

level = 1;

lives = 3;

combo = 0;

coins = 0;

hits = 0;

shots = 0;


time = 30;


targetSpeed = 1500;

targetSize = 70;


resultBox.style.display="none";


target.style.display="none";


updateUI();


}





// =====================================
// START GAME
// =====================================


function startGame(){


resetGame();


playing = true;

paused = false;


message.innerHTML =
"🎯 Mission Started! Hit the targets!";


startTimer();


spawnTarget();


}





// =====================================
// PAUSE
// =====================================


pauseBtn.onclick=function(){


paused = !paused;


if(paused){

message.innerHTML="⏸ Game Paused";

target.style.display="none";

}

else{

message.innerHTML="🔥 Continue Mission";

spawnTarget();

}


};




// =====================================
// RESTART
// =====================================


restartBtn.onclick=function(){

clearAll();

startGame();

};
