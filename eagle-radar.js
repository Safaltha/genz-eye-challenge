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
// =================================
// START GAME
// =================================

function startGame(){

score = 0;
level = 1;
lives = 3;
coins = 0;
combo = 0;

playing = true;
paused = false;

targetTime = 1500;

message.innerHTML =
"🦅 Remember the target location!";

updateUI();

spawnTarget();

}



// =================================
// SPAWN TARGET
// =================================

function spawnTarget(){

if(!playing || paused)
return;


target.style.display="block";


// 🔊 Radar sound

if(gameSound){
playSound("radar");
}


let x =
Math.random() *
(gameArea.clientWidth - 45);


let y =
Math.random() *
(gameArea.clientHeight - 45);



target.style.left = x+"px";
target.style.top = y+"px";



clearTimeout(targetTimer);



targetTimer=setTimeout(()=>{


target.style.display="none";


message.innerHTML =
"👁️ Find the hidden target!";


},targetTime);


}

// =================================
// HIT TARGET
// =================================

target.onclick=function(){

if(!playing || paused)
return;


// 🔊 Hit sound

if(gameSound){
playSound("hit");
}


score += 10;

coins++;

combo++;


if(combo % 5 === 0){

score += 50;

message.innerHTML =
"🔥 Combo Bonus!";

}

else{

message.innerHTML =
"🎯 Perfect Focus!";

}



if(score % 100 === 0){

level++;


// 🔊 Level sound

if(gameSound){
playSound("level");
}


targetTime =
Math.max(400,targetTime-100);


message.innerHTML =
"🏆 Level Up!";

}



updateUI();


target.style.display="none";


setTimeout(()=>{

spawnTarget();

},500);


};




// =================================
// MISSED TARGET
// =================================

function missed(){

if(!playing)
return;


// 🔊 Miss sound

if(gameSound){
playSound("miss");
}


lives--;

combo=0;


message.innerHTML =
"❌ Missed! Focus!";


updateUI();



if(lives<=0){

gameOver();

}


}

// =================================
// TIMER
// =================================

function startTimer(){

clearInterval(countdownTimer);


time = 20;


countdownTimer=setInterval(()=>{


if(!playing || paused)
return;


time--;


if(time<=0){

missed();

time=20;

}


},1000);


}




// =================================
// GAME OVER + MISSION CONNECTION
// =================================

function gameOver(){

playing=false;


clearTimeout(targetTimer);

clearInterval(countdownTimer);


target.style.display="none";


message.innerHTML =
"🎮 Game Over! Score: "+score;



// 🎯 Mission Mode Update

let missionProgress =
Number(localStorage.getItem("mission_0")) || 0;


localStorage.setItem(
"mission_0",
missionProgress + 1
);



saveScore();


}





// =================================
// PAUSE BUTTON
// =================================

pauseBtn.onclick=function(){


paused=!paused;



if(paused){

message.innerHTML =
"⏸ Game Paused";

}

else{

message.innerHTML =
"🔥 Continue!";

spawnTarget();

}


};

// =================================
// SOUND BUTTON
// =================================

soundBtn.onclick=function(){

gameSound = !gameSound;


soundBtn.innerHTML =
gameSound ? "🔊 SOUND" : "🔇 MUTED";

};




// =================================
// SAVE SCORE
// =================================

function saveScore(){

localStorage.setItem(
"eagleScore",
score
);

}




// =================================
// LOAD SCORE
// =================================

let oldScore =
localStorage.getItem("eagleScore");


if(oldScore){

score = Number(oldScore);

}




// =================================
// START BUTTON
// =================================

startBtn.onclick=function(){

startGame();

startTimer();

};




// =================================
// INITIAL LOAD
// =================================

updateUI();
