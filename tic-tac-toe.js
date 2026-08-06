// ======================================
// GEN Z TIC TAC TOE
// FINAL VERSION - PART 1
// ======================================


// Elements

const cells = document.querySelectorAll(".cell");

const statusText = document.getElementById("status");

const friendBtn = document.getElementById("friendBtn");
const computerBtn = document.getElementById("computerBtn");

const difficultyBox = document.getElementById("difficultyBox");
const levelButtons = document.querySelectorAll(".level");

const restartBtn = document.getElementById("restartBtn");
const resetBtn = document.getElementById("resetBtn");

const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupText = document.getElementById("popupText");
const playAgainBtn = document.getElementById("playAgain");

const xScoreText = document.getElementById("xScore");
const oScoreText = document.getElementById("oScore");
const drawScoreText = document.getElementById("drawScore");

const tapSound = document.getElementById("tapSound");
const winSound = document.getElementById("winSound");
const drawSound = document.getElementById("drawSound");
const buttonSound = document.getElementById("buttonSound");


// Game Data

let board = [
"",
"",
"",
"",
"",
"",
"",
"",
""
];


let currentPlayer = "X";

let gameActive = false;

let vsComputer = false;

let difficulty = "easy";


// Scores

let xScore = Number(localStorage.getItem("xScore")) || 0;

let oScore = Number(localStorage.getItem("oScore")) || 0;

let drawScore = Number(localStorage.getItem("drawScore")) || 0;



// Winning combinations

const winPatterns = [

[0,1,2],
[3,4,5],
[6,7,8],

[0,3,6],
[1,4,7],
[2,5,8],

[0,4,8],
[2,4,6]

];


// Update score display

function updateScores(){

xScoreText.textContent = xScore;

oScoreText.textContent = oScore;

drawScoreText.textContent = drawScore;


localStorage.setItem("xScore",xScore);

localStorage.setItem("oScore",oScore);

localStorage.setItem("drawScore",drawScore);

}


updateScores();



// Start game

function startGame(){

board = [
"",
"",
"",
"",
"",
"",
"",
"",
""
];


cells.forEach(cell=>{

cell.textContent="";

cell.classList.remove("x");

cell.classList.remove("o");

cell.classList.remove("win");

});


currentPlayer="X";

gameActive=true;


popup.classList.add("hidden");


statusText.textContent="Player X Turn";


}

// ======================================
// PART 2
// PLAYER MOVEMENT + WIN CHECK
// ======================================


// Friend Mode

friendBtn.onclick = ()=>{

playButtonSound();

vsComputer=false;

difficultyBox.classList.add("hidden");

startGame();

};



// Computer Mode

computerBtn.onclick = ()=>{

playButtonSound();

difficultyBox.classList.remove("hidden");

};



// Difficulty Selection

levelButtons.forEach(button=>{

button.onclick = ()=>{

playButtonSound();

difficulty = button.dataset.level;

vsComputer=true;

difficultyBox.classList.add("hidden");

startGame();

};

});




// Cell Click

cells.forEach((cell,index)=>{


cell.onclick=()=>{


if(!gameActive) return;


if(board[index] !== "") return;


makeMove(index,currentPlayer);


};


});




// Make Move

function makeMove(index,player){


board[index]=player;


cells[index].textContent=player;


cells[index].classList.add(
player.toLowerCase()
);



playTapSound();



if(checkWinner(player)){

return;

}



if(checkDraw()){

return;

}




if(vsComputer && player==="X"){


currentPlayer="O";


statusText.textContent=
"🤖 Computer Thinking...";


setTimeout(()=>{

computerMove();

},600);


}

else{


currentPlayer =
currentPlayer==="X" ? "O" : "X";


statusText.textContent =
"Player "+currentPlayer+" Turn";


}


}





// Winner Check

function checkWinner(player){


for(let pattern of winPatterns){


let a=pattern[0];

let b=pattern[1];

let c=pattern[2];



if(
board[a]===player &&
board[b]===player &&
board[c]===player
){


gameActive=false;



cells[a].classList.add("win");

cells[b].classList.add("win");

cells[c].classList.add("win");



showResult(
"🎉 Congratulations!",
player+" Wins!"
);



if(player==="X"){

xScore++;

}else{

oScore++;

}


updateScores();



playWinSound();


return true;


}


}


return false;


}





// Draw Check

function checkDraw(){


if(board.includes("")){

return false;

}



gameActive=false;


drawScore++;


updateScores();



showResult(
"🤝 Draw Game",
"Nobody Wins!"
);



playDrawSound();



return true;


}

  // ======================================
// PART 3
// COMPUTER AI
// ======================================


// Computer Move

function computerMove(){


if(!gameActive) return;


let move;



if(difficulty==="easy"){


move=randomMove();


}



else if(difficulty==="medium"){


move=Math.random()<0.5
?
bestMove()
:
randomMove();


}



else{


move=bestMove();


}




if(move!==-1){


makeComputerMove(move);


}



}





// Computer places move

function makeComputerMove(index){


board[index]="O";


cells[index].textContent="O";


cells[index].classList.add("o");



playTapSound();



if(checkWinner("O")){

return;

}



if(checkDraw()){

return;

}



currentPlayer="X";


statusText.textContent="Player X Turn";


}






// Random AI

function randomMove(){


let empty=[];



for(let i=0;i<board.length;i++){


if(board[i]===""){


empty.push(i);


}


}



if(empty.length===0){


return -1;


}



return empty[
Math.floor(Math.random()*empty.length)
];


}







// Smart AI

function bestMove(){



// Try winning move

for(let pattern of winPatterns){


let values=pattern.map(i=>board[i]);



if(
values.filter(v=>v==="O").length===2
&&
values.includes("")
){


return pattern[
values.indexOf("")
];


}



}





// Block player

for(let pattern of winPatterns){


let values=pattern.map(i=>board[i]);



if(
values.filter(v=>v==="X").length===2
&&
values.includes("")
){


return pattern[
values.indexOf("")
];


}



}







// Center

if(board[4]===""){


return 4;


}







// Corners

let corners=[0,2,6,8];



for(let corner of corners){


if(board[corner]===""){


return corner;


}


}






return randomMove();



}

  // ======================================
// PART 4
// FINAL CONTROLS + SOUND + EFFECTS
// ======================================


// Sound Functions

function playTapSound(){

if(tapSound){

tapSound.currentTime=0;

tapSound.play().catch(()=>{});

}

}



function playWinSound(){

if(winSound){

winSound.currentTime=0;

winSound.play().catch(()=>{});

}

}



function playDrawSound(){

if(drawSound){

drawSound.currentTime=0;

drawSound.play().catch(()=>{});

}

}



function playButtonSound(){

if(buttonSound){

buttonSound.currentTime=0;

buttonSound.play().catch(()=>{});

}

}




// Show Result Popup

function showResult(title,text){


popupTitle.textContent=title;


popupText.textContent=text;


popup.classList.remove("hidden");



createConfetti();


}




// Restart Button

restartBtn.onclick=()=>{


playButtonSound();


startGame();


};




// Play Again Button

playAgainBtn.onclick=()=>{


playButtonSound();


popup.classList.add("hidden");


startGame();


};





// Reset Score

resetBtn.onclick=()=>{


playButtonSound();



xScore=0;

oScore=0;

drawScore=0;



updateScores();



startGame();



};






// Confetti Effect

function createConfetti(){


let area=document.getElementById("confetti");


area.innerHTML="";



for(let i=0;i<80;i++){


let piece=document.createElement("div");



piece.className="confetti-piece";



piece.style.left=Math.random()*100+"vw";


piece.style.animationDelay=
Math.random()*2+"s";



area.appendChild(piece);



}



setTimeout(()=>{


area.innerHTML="";


},3000);



}




// Keyboard Restart

document.addEventListener("keydown",(e)=>{


if(e.key==="r" || e.key==="R"){


startGame();


}


});




// Initial State

statusText.textContent="Choose Game Mode";
