// =================================
// 🦅 EAGLE RADAR - COMPLETE VERSION
// WITH MISSION CONNECTION
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


let score = 0;
let level = 1;
let lives = 3;
let coins = 0;
let combo = 0;

let playing = false;
let paused = false;
let sound = true;

let targetTimer;
let countdownTimer;

let targetTime = 1500;
let time = 20;



// UPDATE UI

function updateUI(){

scoreText.innerHTML = score;
levelText.innerHTML = level;
livesText.innerHTML = lives;
coinsText.innerHTML = coins;
comboText.innerHTML = combo;

progressBar.style.width =
Math.min(level * 10,100)+"%";

}



// START GAME

function startGame(){

score = 0;
level = 1;
lives = 3;
coins = 0;
combo = 0;

playing = true;
paused = false;

message.innerHTML =
"🦅 Remember the target location!";

updateUI();

spawnTarget();

}



// SPAWN TARGET

function spawnTarget(){

if(!playing || paused)
return;


target.style.display="block";


let x =
Math.random() *
(gameArea.clientWidth - 45);


let y =
Math.random() *
(gameArea.clientHeight - 45);



target.style.left=x+"px";
target.style.top=y+"px";



clearTimeout(targetTimer);


targetTimer=setTimeout(()=>{


target.style.display="none";


message.innerHTML =
"👁️ Find the target!";


},targetTime);


}



// HIT TARGET

target.onclick=function(){

if(!playing || paused)
return;


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
"🎯 Great Focus!";

}



if(score % 100 === 0){

level++;

targetTime =
Math.max(400,targetTime-100);

}



updateUI();


target.style.display="none";


setTimeout(()=>{

spawnTarget();

},500);


};




// MISSED

function missed(){


if(!playing)
return;


lives--;

combo=0;


message.innerHTML =
"❌ Missed Target";


updateUI();



if(lives<=0){

gameOver();

}

}




// TIMER

function startTimer(){

clearInterval(countdownTimer);


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



// GAME OVER

function gameOver(){


playing=false;


clearTimeout(targetTimer);

clearInterval(countdownTimer);


target.style.display="none";


message.innerHTML =
"🎮 Game Over! Score: "+score;



// 🎯 MISSION MODE CONNECTION

let progress =
Number(localStorage.getItem("mission_0")) || 0;


localStorage.setItem(
"mission_0",
progress + 1
);



saveScore();


}




// PAUSE

pauseBtn.onclick=function(){


paused=!paused;


if(paused){

message.innerHTML="⏸ Paused";

}

else{

message.innerHTML="🔥 Continue";

spawnTarget();

}

};




// SOUND

soundBtn.onclick=function(){

sound=!sound;

soundBtn.innerHTML =
sound ? "🔊 SOUND" : "🔇 MUTED";

};




// SAVE SCORE

function saveScore(){

localStorage.setItem(
"eagleScore",
score
);

}



// LOAD SCORE

let oldScore =
localStorage.getItem("eagleScore");


if(oldScore){

score=Number(oldScore);

}



// START BUTTON

startBtn.onclick=function(){

startGame();

startTimer();

};



// INIT

updateUI();
