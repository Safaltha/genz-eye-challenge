
let score = 0;
let streak = 0;
let level = 1;

const scoreDisplay = document.getElementById("score");
const streakDisplay = document.getElementById("streak");
const levelDisplay = document.getElementById("level");



function updateStats(){

scoreDisplay.innerText = score;
streakDisplay.innerText = streak;
levelDisplay.innerText = level;

}



function addScore(points){

score += points;
streak++;

if(score >= level * 100){

level++;

}

updateStats();

saveProgress();

}




function saveProgress(){

localStorage.setItem(
"eyeScore",
score
);

localStorage.setItem(
"eyeStreak",
streak
);

localStorage.setItem(
"eyeLevel",
level
);

}





function loadProgress(){

score =
Number(localStorage.getItem("eyeScore")) || 0;

streak =
Number(localStorage.getItem("eyeStreak")) || 0;

level =
Number(localStorage.getItem("eyeLevel")) || 1;


updateStats();

}


loadProgress();





const gameButtons =
document.querySelectorAll(".gameBtn");



gameButtons.forEach(button=>{


button.addEventListener("click",()=>{


let game =
button.dataset.game;


startGame(game);



});


});







function startGame(game){


if(game==="reaction"){

reactionGame();

}

else if(game==="memory"){

memoryGame();

}

else if(game==="color"){

colorGame();

}

else if(game==="number"){

numberGame();

}

else if(game==="object"){

objectGame();

}

else{

eyeIQ();

}


}








function reactionGame(){

let start =
Date.now();


alert("Wait for green signal...");


setTimeout(()=>{


let time =
Date.now()-start;


let result =
Math.floor(Math.random()*500)+200;


alert(
"Your reaction score: "
+ result
+ " ms"
);


addScore(20);


},2000);


}







function memoryGame(){


let number =
Math.floor(Math.random()*900)+100;


alert(
"Remember this number: "
+ number
);


setTimeout(()=>{


let answer =
prompt("Enter the number");


if(answer==number){

alert("Correct! 🎉");

addScore(30);

}

else{

alert("Wrong! Try again.");

streak=0;

updateStats();

}


},3000);


}







function colorGame(){


let colors=[
"Red",
"Blue",
"Green",
"Yellow",
"Purple"
];


let correct =
colors[Math.floor(Math.random()*colors.length)];


let answer =
prompt(
"Find this color: "
+ correct
);


if(answer &&
answer.toLowerCase()
===
correct.toLowerCase()){


alert("Perfect 👁️");

addScore(25);


}

else{

alert("Try again");

}


}








function numberGame(){


let secret =
Math.floor(Math.random()*10)+1;


let guess =
prompt(
"Guess number 1-10"
);


if(Number(guess)===secret){

alert("Amazing!");

addScore(40);

}

else{

alert(
"Wrong number. It was "
+secret
);

}


}







function objectGame(){

alert(
"Find the hidden object challenge coming soon 🔍"
);

addScore(10);

}







function eyeIQ(){

let iq =
Math.floor(Math.random()*50)+50;


alert(
"Your Eye IQ score: "
+iq
);


addScore(15);


}






document.getElementById("resetBtn")
.addEventListener("click",()=>{


localStorage.clear();


score=0;
streak=0;
level=1;


updateStats();


alert("Progress reset");


});
