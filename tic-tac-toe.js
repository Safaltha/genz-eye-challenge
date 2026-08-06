
// ======================================
// GEN Z TIC TAC TOE
// UPDATED FINAL VERSION - PART 1
// ======================================


// ======================
// ELEMENTS
// ======================

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



// ======================
// SOUNDS
// ======================

const tapSound = document.getElementById("tapSound");
const winSound = document.getElementById("winSound");
const loseSound = document.getElementById("loseSound");
const drawSound = document.getElementById("drawSound");
const buttonSound = document.getElementById("buttonSound");


tapSound.src = "tap.mp3";

winSound.src = "win.mp3";

loseSound.src = "lose.mp3";

drawSound.src = "draw.mp3";

buttonSound.src = "button.mp3";



// ======================
// GAME DATA
// ======================

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



// ======================
// SCORE DATA
// ======================

let xScore = Number(localStorage.getItem("xScore")) || 0;

let oScore = Number(localStorage.getItem("oScore")) || 0;

let drawScore = Number(localStorage.getItem("drawScore")) || 0;



// ======================
// WIN PATTERNS
// ======================

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




// ======================
// UPDATE SCORES
// ======================

function updateScores(){

xScoreText.textContent = xScore;

oScoreText.textContent = oScore;

drawScoreText.textContent = drawScore;


localStorage.setItem("xScore",xScore);

localStorage.setItem("oScore",oScore);

localStorage.setItem("drawScore",drawScore);

}


updateScores();




// ======================
// START GAME
// ======================

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



// ======================
// FRIEND MODE
// ======================

friendBtn.onclick = ()=>{

playButtonSound();

vsComputer=false;

difficultyBox.classList.add("hidden");

startGame();

};





// ======================
// COMPUTER MODE
// ======================

computerBtn.onclick = ()=>{

playButtonSound();

difficultyBox.classList.remove("hidden");

};





// ======================
// DIFFICULTY
// ======================

levelButtons.forEach(button=>{

button.onclick=()=>{

playButtonSound();

difficulty=button.dataset.level;

vsComputer=true;

difficultyBox.classList.add("hidden");

startGame();

};

});





// ======================
// CELL CLICK
// ======================

cells.forEach((cell,index)=>{


cell.onclick=()=>{


if(!gameActive) return;


if(board[index] !== "") return;


makeMove(index,currentPlayer);


};


});





// ======================
// MAKE MOVE
// ======================

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







// ======================
// WINNER CHECK
// ======================

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

// 🤖 COMPUTER WINS
if(vsComputer && player==="O"){

oScore++;
updateScores();

popupTitle.textContent="😢 You Lose!";
popupText.textContent="🤖 Computer Wins! Better luck next time.";

popup.classList.remove("hidden");

playLoseSound();

return true;

}

// 👤 PLAYER WINS
if(vsComputer && player==="X"){

xScore++;
updateScores();

popupTitle.textContent="🎉 Congratulations!";
popupText.textContent="🏆 You Beat the Computer!";

popup.classList.remove("hidden");

createConfetti();

playWinSound();

return true;

}

// 👥 FRIEND MODE
if(!vsComputer){

if(player==="X"){
xScore++;
}else{
oScore++;
}

updateScores();

popupTitle.textContent="🎉 Congratulations!";
popupText.textContent="Player " + player + " Wins!";

popup.classList.remove("hidden");

createConfetti();

playWinSound();

return true;

}

}

}

return false;

}






// ======================
// DRAW CHECK
// ======================

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



// ======================
// COMPUTER MOVE
// ======================

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






// ======================
// COMPUTER PLACE MOVE
// ======================

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







// ======================
// RANDOM MOVE
// ======================

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







// ======================
// SMART AI
// ======================

function bestMove(){



// Computer winning move

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






// Block player winning move

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







// Take center

if(board[4]===""){


return 4;


}







// Take corners

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
// SOUNDS + POPUP + CONTROLS
// ======================================



// ======================
// SOUND FUNCTIONS
// ======================


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




function playLoseSound(){

if(loseSound){

loseSound.currentTime=0;

loseSound.play().catch(()=>{});

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







// ======================
// SHOW RESULT
// ======================

function showResult(title,text){


popupTitle.textContent=title;


popupText.textContent=text;


popup.classList.remove("hidden");



createConfetti();


}








// ======================
// RESTART BUTTON
// ======================

restartBtn.onclick=()=>{


playButtonSound();


startGame();


};






// ======================
// PLAY AGAIN
// ======================

playAgainBtn.onclick=()=>{


playButtonSound();


popup.classList.add("hidden");


startGame();


};







// ======================
// RESET SCORE
// ======================

resetBtn.onclick=()=>{


playButtonSound();



xScore=0;

oScore=0;

drawScore=0;



updateScores();


startGame();


};








// ======================
// CONFETTI EFFECT
// ======================

function createConfetti(){


let area=document.getElementById("confetti");


if(!area) return;



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







// ======================
// KEYBOARD RESTART
// ======================

document.addEventListener("keydown",(e)=>{


if(e.key==="r" || e.key==="R"){


startGame();


}


});







// ======================
// INITIAL MESSAGE
// ======================

statusText.textContent="Choose Game Mode";
