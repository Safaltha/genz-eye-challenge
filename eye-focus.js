// ==========================================
// GEN Z EYE FOCUS CHALLENGE
// JAVASCRIPT
// PART 1: SETUP + SAVE SYSTEM
// ==========================================


// ---------- ELEMENTS ----------

const grid = document.getElementById("grid");

const levelText = document.getElementById("level");
const scoreText = document.getElementById("score");
const timerText = document.getElementById("timer");

const message = document.getElementById("message");

const progressBar = document.getElementById("progressBar");

const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const resetBtn = document.getElementById("resetBtn");


const streakText = document.getElementById("streak");
const bestStreakText = document.getElementById("bestStreak");
const accuracyText = document.getElementById("accuracy");

const achievement =
document.getElementById("achievement");


// ---------- AUDIO ----------

const tapSound =
document.getElementById("tapSound");

const winSound =
document.getElementById("winSound");

const loseSound =
document.getElementById("loseSound");

const buttonSound =
document.getElementById("buttonSound");


// Sound files

tapSound.src="tap.mp3";
winSound.src="win.mp3";
loseSound.src="lose.mp3";
buttonSound.src="button.mp3";



// ---------- SAVED DATA ----------


let level =
Number(localStorage.getItem("eyeLevel")) || 1;


let score =
Number(localStorage.getItem("eyeScore")) || 0;


let highestLevel =
Number(localStorage.getItem("eyeHighest")) || level;


let streak =
Number(localStorage.getItem("eyeStreak")) || 0;


let bestStreak =
Number(localStorage.getItem("eyeBest")) || 0;


let correctAnswers =
Number(localStorage.getItem("eyeCorrect")) || 0;


let wrongAnswers =
Number(localStorage.getItem("eyeWrong")) || 0;



// ---------- GAME VARIABLES ----------


let timer = 30;

let timerInterval;

let correctPosition;

let gameStarted = false;



// ---------- SAVE FUNCTION ----------


function saveGame(){

localStorage.setItem(
"eyeLevel",
level
);


localStorage.setItem(
"eyeScore",
score
);


localStorage.setItem(
"eyeHighest",
highestLevel
);


localStorage.setItem(
"eyeStreak",
streak
);


localStorage.setItem(
"eyeBest",
bestStreak
);


localStorage.setItem(
"eyeCorrect",
correctAnswers
);


localStorage.setItem(
"eyeWrong",
wrongAnswers
);

}




// ---------- UPDATE SCREEN ----------


function updateUI(){


levelText.textContent =
level;


scoreText.textContent =
score;


timerText.textContent =
timer;


streakText.textContent =
streak;


bestStreakText.textContent =
bestStreak;



let total =
correctAnswers + wrongAnswers;


let accuracy = 100;


if(total > 0){

accuracy =
Math.round(
(correctAnswers / total) * 100
);

}


accuracyText.textContent =
accuracy+"%";



progressBar.style.width =
(level/100)*100+"%";


}
// ==========================================
// PART 2: LEVEL SYSTEM + GRID GENERATOR
// ==========================================


// ---------- DIFFICULTY CONTROL ----------


function getDifficulty(){


let size;
let time;


if(level <= 10){

size = 3;
time = 30;

}


else if(level <= 25){

size = 4;
time = 25;

}


else if(level <= 50){

size = 5;
time = 20;

}


else if(level <= 75){

size = 6;
time = 15;

}


else{

size = 7;
time = 10;

}


return {

size:size,
time:time

};


}



// ---------- LETTER GENERATOR ----------


function getLetters(){


let normal;
let different;


let pairs = [

["A","B"],
["E","F"],
["O","Q"],
["P","R"],
["C","G"],
["M","N"],
["I","L"],
["T","Y"]

];



let random =
Math.floor(
Math.random()*pairs.length
);



normal =
pairs[random][0];


different =
pairs[random][1];



return {

normal:normal,
different:different

};


}



// ---------- CREATE GRID ----------


function createGrid(){


grid.innerHTML="";


let difficulty =
getDifficulty();



timer =
difficulty.time;


timerText.textContent =
timer;



let letters =
getLetters();



let totalCells =
difficulty.size *
difficulty.size;



correctPosition =
Math.floor(
Math.random()*totalCells
);



for(let i=0;i<totalCells;i++){


let cell =
document.createElement("div");



cell.className =
"cell";



if(i === correctPosition){


cell.textContent =
letters.different;


cell.dataset.correct =
"true";

}

else{


cell.textContent =
letters.normal;


}



cell.onclick=function(){

checkAnswer(cell);

};



grid.appendChild(cell);



}



grid.style.gridTemplateColumns =
`repeat(${difficulty.size},60px)`;



}

// ==========================================
// PART 3: TIMER + ANSWER SYSTEM
// ==========================================


// ---------- START TIMER ----------


function startTimer(){


clearInterval(timerInterval);


timerInterval =
setInterval(()=>{


timer--;


timerText.textContent =
timer;



if(timer <= 0){


clearInterval(timerInterval);


wrongAnswers++;


streak = 0;


message.textContent =
"⏰ Time Over! Try Again";


loseSound.play();


saveGame();

updateUI();



}


},1000);



}



// ---------- CHECK ANSWER ----------


function checkAnswer(cell){


if(!gameStarted){

return;

}



if(cell.dataset.correct === "true"){



clearInterval(timerInterval);



cell.classList.add("correct");



tapSound.play();



let points =
level * 10;



score += points;



streak++;



correctAnswers++;



if(streak > bestStreak){

bestStreak = streak;

}



if(level >= highestLevel){

highestLevel =
level + 1;

}



message.textContent =
"🔥 Great Eye! +" + points + " Points";



winSound.play();




if(level % 10 === 0){


achievement.textContent =
"🏆 Level " + level + " Master!";


}



nextBtn.style.display =
"inline-block";



gameStarted = false;



saveGame();

updateUI();



}



else{


cell.classList.add("wrong");



loseSound.play();



message.textContent =
"❌ Wrong Letter!";


streak = 0;


wrongAnswers++;


saveGame();

updateUI();



}



}



// ---------- LOAD NEXT LEVEL ----------


function nextLevel(){


level++;


if(level > 100){


level = 100;


achievement.textContent =
"👑 You completed all 100 levels!";


}



nextBtn.style.display =
"none";


message.textContent =
"Find the different letter 👁️";



createGrid();



gameStarted = true;



startTimer();



updateUI();



saveGame();



}

  // ==========================================
// PART 4: BUTTONS + CONTINUE SYSTEM
// ==========================================


// ---------- START / CONTINUE GAME ----------


startBtn.onclick = function(){


buttonSound.play();


gameStarted = true;


message.textContent =
"Find the different letter 👁️";


createGrid();


startTimer();


updateUI();


};




// ---------- NEXT LEVEL BUTTON ----------


nextBtn.onclick = function(){


buttonSound.play();


nextLevel();


};




// ---------- RESTART CURRENT GAME ----------


restartBtn.onclick = function(){


buttonSound.play();



clearInterval(timerInterval);



gameStarted = true;



message.textContent =
"Restarted Level " + level;



createGrid();



startTimer();



};




// ---------- RESET EVERYTHING ----------


resetBtn.onclick = function(){



let confirmReset =
confirm(
"Delete all progress?"
);



if(confirmReset){



localStorage.clear();



location.reload();



}



};




// ---------- LOAD SAVED PROGRESS MESSAGE ----------


function showWelcome(){



if(level > 1){


message.textContent =
"👋 Welcome back! Continue Level " + level;


}


else{


message.textContent =
"Press Start and test your eyes 👁️";


}



}




// ---------- INITIAL LOAD ----------


nextBtn.style.display =
"none";


updateUI();


showWelcome();  

// ==========================================
// PART 5: EFFECTS + ACHIEVEMENTS + POLISH
// ==========================================


// ---------- CONFETTI ----------


function createConfetti(){


let container =
document.getElementById("confetti");


if(!container){

return;

}



for(let i=0;i<40;i++){


let piece =
document.createElement("div");


piece.className =
"confetti-piece";


piece.style.left =
Math.random()*100 + "%";


piece.style.animationDelay =
Math.random()*2 + "s";


container.appendChild(piece);



setTimeout(()=>{

piece.remove();

},3000);



}



}



// ---------- VIBRATION ----------


function vibrate(){


if(navigator.vibrate){


navigator.vibrate(100);


}


}




// ---------- ACHIEVEMENT CHECK ----------


function checkAchievements(){



if(score >= 1000){


achievement.textContent =
"🥉 Eye Explorer - 1000 Points";


}



if(score >= 5000){


achievement.textContent =
"🥈 Eye Master - 5000 Points";


}



if(score >= 10000){


achievement.textContent =
"🥇 Eye Legend - 10000 Points";


}



if(level >= 50){


achievement.textContent =
"🔥 Half Century Eye Champion";


}



if(level >= 100){


achievement.textContent =
"👑 Ultimate Eye Focus Legend";


}



}




// ---------- UPDATE WIN EFFECT ----------


const oldCheckAnswer =
checkAnswer;



// extra effect after correct answer

window.addEventListener(
"click",
function(e){


if(e.target.classList.contains("correct")){


createConfetti();

vibrate();

checkAchievements();


}


});





// ---------- RANDOM GRID FIX ----------


let previousPosition = -1;


function newRandomPosition(total){


let position;


do{


position =
Math.floor(
Math.random()*total
);


}
while(
position === previousPosition
);



previousPosition = position;


return position;


}
    
