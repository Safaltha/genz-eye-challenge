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

// =====================================
// PART 2: TARGET SYSTEM
// =====================================


function spawnTarget(){


if(!playing || paused) return;


clearTimeout(targetTimer);


target.style.display="block";


// Random position

let maxX = arena.clientWidth - targetSize;

let maxY = arena.clientHeight - targetSize;


let x = Math.random()*maxX;

let y = Math.random()*maxY;



target.style.left = x+"px";

target.style.top = y+"px";

target.style.width = targetSize+"px";

target.style.height = targetSize+"px";



// Target type

let chance = Math.random();


if(chance < 0.15){

// Bonus target

target.dataset.type="bonus";

target.style.background=
"radial-gradient(circle,yellow,cyan)";

}

else if(chance < 0.25){

// Trap target

target.dataset.type="trap";

target.style.background=
"radial-gradient(circle,black,red)";

}

else{

// Normal target

target.dataset.type="normal";

target.style.background=
"radial-gradient(circle,white,yellow,red)";

}




// Auto disappear

targetTimer=setTimeout(()=>{


if(target.style.display==="block"){


missTarget();


}


},targetSpeed);



}




// =====================================
// SHOOT TARGET
// =====================================


target.onclick=function(){


if(!playing || paused)
return;


shots++;


let type = target.dataset.type;



if(type==="trap"){


lives--;

combo=0;


message.innerHTML=
"💣 Trap hit! Life lost";


}

else{


hits++;

combo++;



if(type==="bonus"){


score += 30;

coins += 5;


message.innerHTML=
"💎 Bonus Target! +30";


}

else{


let points = 10 + (combo*2);


score += points;


coins +=1;


message.innerHTML=
"🎯 Perfect Shot! +"+points;


}



}



target.classList.add("hit");


setTimeout(()=>{

target.classList.remove("hit");

},300);



target.style.display="none";


checkLevel();


updateUI();



if(lives<=0){


gameOver();


return;

}



spawnTarget();


};




// =====================================
// MISSED TARGET
// =====================================


function missTarget(){


target.style.display="none";


shots++;


combo=0;


lives--;


message.innerHTML=
"❌ Missed! Focus your aim";


updateUI();



if(lives<=0){


gameOver();

}

else{


spawnTarget();

}


}





// =====================================
// LEVEL SYSTEM
// =====================================


function checkLevel(){


let newLevel =
Math.floor(score/100)+1;



if(newLevel > level){


level = newLevel;


message.innerHTML =
"🔥 Level "+level+" Unlocked!";



// Increase difficulty


targetSpeed = Math.max(
400,
targetSpeed-80
);


targetSize = Math.max(
35,
targetSize-2
);



}


modeText.innerHTML =
level%10===0
?
"👑 BOSS ROUND"
:
"🎮 Normal Mode";



}





// =====================================
// CLEAR TIMERS
// =====================================


function clearAll(){


clearInterval(gameTimer);

clearTimeout(targetTimer);

clearInterval(moveTimer);


}


// =====================================
// PART 3: TIMER SYSTEM
// =====================================


function startTimer(){


clearInterval(gameTimer);


time = 30;

timeText.innerHTML=time;



gameTimer=setInterval(()=>{


if(!playing || paused) return;


time--;


timeText.innerHTML=time;



if(time<=0){


gameOver();


}


},1000);



}




// =====================================
// GAME OVER
// =====================================


function gameOver(){


playing=false;


clearAll();


target.style.display="none";


resultBox.style.display="block";



let accuracy =
shots===0 ? 0 :
Math.floor((hits/shots)*100);



resultTitle.innerHTML=
"🎮 Mission Complete";


resultText.innerHTML=
`
⭐ Score: ${score}<br>
🎯 Accuracy: ${accuracy}%<br>
🪙 Coins: ${coins}<br>
🏆 Level: ${level}
`;



saveData();


}





// =====================================
// SAVE PROGRESS
// =====================================


function saveData(){


localStorage.setItem(
"cyberScore",
score
);


localStorage.setItem(
"cyberLevel",
level
);


localStorage.setItem(
"cyberCoins",
coins
);


}




// =====================================
// LOAD PROGRESS
// =====================================


function loadData(){


let oldScore =
localStorage.getItem("cyberScore");


let oldLevel =
localStorage.getItem("cyberLevel");


let oldCoins =
localStorage.getItem("cyberCoins");



if(oldScore){

score = Number(oldScore);

}



if(oldLevel){

level = Number(oldLevel);

}



if(oldCoins){

coins = Number(oldCoins);

}



updateUI();


}



loadData();




// =====================================
// BUTTON EVENTS
// =====================================


startBtn.onclick=function(){

startGame();

};

// =====================================
// PART 4: ADVANCED GAME FEATURES
// =====================================



// =====================================
// BOSS ROUND SYSTEM
// =====================================


function bossRound(){


if(level % 10 !== 0) return;



modeText.innerHTML =
"👑 BOSS TARGET";



targetSize = 100;

targetSpeed = 700;



message.innerHTML =
"⚠️ BOSS INCOMING! HIT THE GIANT TARGET!";



}




// =====================================
// MOVING TARGET SYSTEM
// =====================================


function startMoving(){


clearInterval(moveTimer);



moveTimer=setInterval(()=>{


if(
playing &&
!paused &&
target.style.display==="block"
){


let x =
Math.random() *
(arena.clientWidth-targetSize);



let y =
Math.random() *
(arena.clientHeight-targetSize);



target.style.left=x+"px";

target.style.top=y+"px";


}



},700);



}





// =====================================
// LEVEL REWARD
// =====================================


function levelReward(){


if(level % 5 === 0){


coins += 10;


message.innerHTML =
"🎁 Level Reward +10 Coins";


}


}




// =====================================
// ACHIEVEMENT SYSTEM
// =====================================


function achievement(){


if(score>=1000){

return "🏆 Cyber Legend";

}


if(score>=500){

return "🔥 Elite Sniper";

}


if(score>=200){

return "🎯 Expert Shooter";

}


return "🌱 Beginner";



}





// =====================================
// SOUND SYSTEM
// =====================================


let audioEnabled=true;



function playShotSound(){


if(!audioEnabled)
return;


// Small browser beep

let sound =
new Audio(
"data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YRAAAAAA"
);


sound.play();



}





target.addEventListener(
"click",
playShotSound
);





// =====================================
// EXTRA START CHECK
// =====================================


startBtn.addEventListener(
"click",
()=>{


startMoving();

bossRound();

levelReward();


}
);

// =====================================
// PART 5: FINAL POLISH
// =====================================



// =====================================
// HIGH SCORE SYSTEM
// =====================================


function saveHighScore(){


let best =
Number(localStorage.getItem("cyberBest")) || 0;



if(score > best){


localStorage.setItem(
"cyberBest",
score
);


return true;


}


return false;


}





function showHighScore(){


let best =
localStorage.getItem("cyberBest") || 0;



message.innerHTML +=
"<br>🏆 Best Score: "+best;


}





// =====================================
// COMBO BONUS
// =====================================


function comboBonus(){


if(combo>=5){


score += 50;

coins +=5;


message.innerHTML =
"🔥 Combo Bonus +50";


combo=0;


}


}





// =====================================
// FINAL GAME RESULT UPDATE
// =====================================


const oldGameOver = gameOver;


gameOver = function(){


oldGameOver();


let newRecord =
saveHighScore();



if(newRecord){


resultText.innerHTML +=
"<br>🎉 NEW HIGH SCORE!";


}


resultText.innerHTML +=
"<br>🏅 Rank: "+achievement();


showHighScore();


};





// =====================================
// BETTER TARGET HIT EFFECT
// =====================================


target.onclick = function(){


if(!playing || paused)
return;



shots++;


let type =
target.dataset.type;



if(type==="trap"){


lives--;

combo=0;


message.innerHTML =
"💣 Trap Target!";


}


else{


hits++;

combo++;


let points =
10 + combo*2;



if(type==="bonus"){


points +=30;

coins +=5;


}



score += points;

coins++;


comboBonus();



}



target.style.display="none";


checkLevel();


updateUI();



if(level % 10===0){

bossRound();

}



if(lives<=0){

gameOver();

}

else{

spawnTarget();

}



};





// =====================================
// INITIAL MESSAGE
// =====================================


message.innerHTML =
"🎯 Cyber Sniper Ready. Press Start!";


updateUI();
