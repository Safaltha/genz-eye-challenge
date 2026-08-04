
// GEN Z EYE CHALLENGE AI
// Main Game Controller


let score = 0;
let streak = 0;
let level = 1;

let currentQuestion = 1;
let totalQuestions = 5;

let timer = 30;
let timerInterval;



const scoreEl = document.getElementById("score");
const streakEl = document.getElementById("streak");
const levelEl = document.getElementById("level");

const questionImage =
document.getElementById("questionImage");

const answerImage =
document.getElementById("answerImage");

const answerBox =
document.getElementById("answerBox");

const questionNumber =
document.getElementById("questionNumber");

const progressBar =
document.getElementById("progressBar");

const timerEl =
document.getElementById("timer");




// START BUTTON


document.getElementById("playBtn")
.onclick = ()=>{

document
.getElementById("quiz")
.scrollIntoView();

startTimer();

};





// SHOW ANSWER


document.getElementById("answerBtn")
.onclick=()=>{

answerBox.style.display="block";

};






// NEXT QUESTION


document.getElementById("nextBtn")
.onclick=()=>{


if(currentQuestion < totalQuestions){

currentQuestion++;

loadQuestion();

}

else{


alert(
"🎉 Challenge Complete! Score: "
+score
);


saveScore();


}


};





function loadQuestion(){


questionImage.src =
"question"+currentQuestion+".jpg";


answerImage.src =
"answer"+currentQuestion+".jpg";


questionNumber.innerHTML =
currentQuestion;


answerBox.style.display="none";


progressBar.style.width =
(currentQuestion/totalQuestions*100)
+"%";


timer=30;

timerEl.innerHTML=timer;


}




// TIMER


function startTimer(){


clearInterval(timerInterval);


timerInterval=setInterval(()=>{


timer--;

timerEl.innerHTML=timer;



if(timer<=0){


clearInterval(timerInterval);


alert(
"⏰ Time Over!"
);


}


},1000);


}





// SCORE SYSTEM


function addScore(points){


score += points;

streak++;


if(streak%5===0){

level++;

}


scoreEl.innerHTML=score;

streakEl.innerHTML=streak;

levelEl.innerHTML=level;


saveScore();


}





// SAVE DATA


function saveScore(){


localStorage.setItem(
"bestScore",
score
);


document.getElementById(
"bestScore"
).innerHTML=score;


}





let oldScore =
localStorage.getItem("bestScore");


if(oldScore){

document.getElementById(
"bestScore"
).innerHTML=oldScore;

}



// DARK MODE


document.getElementById("themeBtn")
.onclick=()=>{


document.body.classList.toggle(
"light"
);


};




// SHARE


document.getElementById("shareBtn")
.onclick=()=>{


navigator.share({

title:"Gen Z Eye Challenge",

text:
"I scored "
+score+
" points! Can you beat me?"

});


};


// =========================
// GAME BUTTON CONTROLLER
// =========================


document.querySelectorAll(".gameBtn")
.forEach(button=>{


button.onclick=()=>{


let game = button.dataset.game;


let area =
document.getElementById("gameArea");



if(game==="eye"){

area.innerHTML=`

<h2>👁️ Eye Challenge</h2>

<p>Click Start Challenge above and play!</p>

`;

}



if(game==="tic"){

startTicTacToe(area);

}



if(game==="memory"){

startMemory(area);

}



if(game==="reaction"){

startReaction(area);

}



if(game==="color"){

startColorGame(area);

}



if(game==="chess"){

startChess(area);

}



if(game==="ludo"){

startLudo(area);

}



};


});





// =========================
// TIC TAC TOE VS AI
// =========================


let ticBoard=[];


function startTicTacToe(area){


ticBoard=[
"","","",
"","","",
"","",""
];



area.innerHTML=`

<h2>❌⭕ Tic Tac Toe</h2>

<div class="tic-board" id="ticBoard"></div>

<p id="ticMessage"></p>

`;



drawTic();

}



function drawTic(){


let board =
document.getElementById("ticBoard");


board.innerHTML="";



ticBoard.forEach((cell,index)=>{


let div =
document.createElement("div");


div.className="tic-cell";

div.innerHTML=cell;


div.onclick=()=>{


if(cell===""){

ticBoard[index]="X";

drawTic();


setTimeout(aiMove,500);


}


};


board.appendChild(div);


});


}




function aiMove(){


let empty=[];


ticBoard.forEach((v,i)=>{

if(v==="") empty.push(i);

});



if(empty.length){


let move =
empty[Math.floor(
Math.random()*empty.length
)];


ticBoard[move]="O";


drawTic();


}



}





// =========================
// MEMORY GAME
// =========================



function startMemory(area){


let cards=[
"👁️","🎮",
"🧠","🔥",
"⭐","🎯",
"🤖","🏆"
];


let gameCards =
[...cards,...cards]
.sort(()=>Math.random()-0.5);



area.innerHTML=`

<h2>🧠 Memory Match</h2>

<div class="memory-board" id="memoryBoard"></div>

`;



let board =
document.getElementById(
"memoryBoard"
);


let first=null;



gameCards.forEach(icon=>{


let card=
document.createElement("div");


card.className="card";

card.innerHTML="❓";



card.onclick=()=>{


card.innerHTML=icon;



if(first){

if(first.innerHTML===card.innerHTML){

addScore(10);


}else{

setTimeout(()=>{

first.innerHTML="❓";

card.innerHTML="❓";

},500);


}


first=null;


}else{


first=card;


}



};



board.appendChild(card);


});


}





// =========================
// REACTION TEST
// =========================



function startReaction(area){


area.innerHTML=`

<h2>⚡ Reaction Test</h2>

<button id="reactionBtn">

WAIT...

</button>

<p id="reactionResult"></p>

`;



let btn=
document.getElementById(
"reactionBtn"
);


let start;


setTimeout(()=>{


btn.innerHTML="CLICK NOW";


start=Date.now();


btn.onclick=()=>{


let time=
Date.now()-start;


document.getElementById(
"reactionResult"
)
.innerHTML=
"Your reaction: "
+time+
" ms";


addScore(5);


};



},2000);



}


// =========================
// COLOR DETECTOR GAME
// =========================


function startColorGame(area){


let colors=[
"red",
"blue",
"green",
"yellow"
];


let correct =
colors[Math.floor(
Math.random()*colors.length
)];


let options=[
...colors
].sort(()=>Math.random()-0.5);



area.innerHTML=`

<h2>🎨 Color Detector</h2>

<p>Find the correct color:</p>

<h1 style="color:${correct}">
${correct.toUpperCase()}
</h1>

<div id="colorButtons"></div>

`;



let box =
document.getElementById(
"colorButtons"
);



options.forEach(color=>{


let btn =
document.createElement("button");


btn.innerHTML=color;


btn.onclick=()=>{


if(color===correct){

addScore(10);

alert("✅ Correct!");

}

else{

alert("❌ Wrong!");

}


};



box.appendChild(btn);


});


}







// =========================
// HIDDEN NUMBER GAME
// =========================



function startNumberGame(area){


let number =
Math.floor(Math.random()*10)+1;



area.innerHTML=`

<h2>🔢 Hidden Number</h2>

<p>Guess number between 1-10</p>

<input id="guessInput">

<button id="guessBtn">
Guess
</button>

<p id="guessResult"></p>

`;



document
.getElementById("guessBtn")
.onclick=()=>{


let guess =
Number(
document.getElementById(
"guessInput"
).value
);



if(guess===number){

document.getElementById(
"guessResult"
)
.innerHTML="🎉 Correct!";


addScore(10);


}

else{


document.getElementById(
"guessResult"
)
.innerHTML="❌ Try again";


}


};


}







// =========================
// BASIC CHESS
// =========================



function startChess(area){


let pieces=[
"♜","♞","♝","