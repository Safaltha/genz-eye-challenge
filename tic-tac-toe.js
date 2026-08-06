// ========================================
// GEN Z TIC TAC TOE
// PART 1
// ========================================

// Board
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");

// Buttons
const friendBtn = document.getElementById("friendBtn");
const computerBtn = document.getElementById("computerBtn");
const difficultyBox = document.getElementById("difficultyBox");
const levelButtons = document.querySelectorAll(".level");
const restartBtn = document.getElementById("restartBtn");
const resetBtn = document.getElementById("resetBtn");
const playAgainBtn = document.getElementById("playAgain");

// Popup
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupText = document.getElementById("popupText");

// Score
const xScoreText = document.getElementById("xScore");
const oScoreText = document.getElementById("oScore");
const drawScoreText = document.getElementById("drawScore");

// Sounds
const tapSound = document.getElementById("tapSound");
const winSound = document.getElementById("winSound");
const drawSound = document.getElementById("drawSound");
const buttonSound = document.getElementById("buttonSound");

// Sound files
tapSound.src = "sounds/tap.mp3";
winSound.src = "sounds/win.mp3";
drawSound.src = "sounds/draw.mp3";
buttonSound.src = "sounds/button.mp3";

// Game Variables
let board = ["","","","","","","","",""];
let currentPlayer = "X";
let gameActive = false;
let vsComputer = false;
let difficulty = "easy";

// Scores
let xScore = Number(localStorage.getItem("xScore")) || 0;
let oScore = Number(localStorage.getItem("oScore")) || 0;
let drawScore = Number(localStorage.getItem("drawScore")) || 0;

// Winning Patterns
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

// Update Scores
function updateScores(){

xScoreText.textContent = xScore;
oScoreText.textContent = oScore;
drawScoreText.textContent = drawScore;

localStorage.setItem("xScore",xScore);
localStorage.setItem("oScore",oScore);
localStorage.setItem("drawScore",drawScore);

}

updateScores();

// Start Game
function startGame(){

board = ["","","","","","","","",""];

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

// Friend Mode
friendBtn.onclick=()=>{

buttonSound.play().catch(()=>{});

vsComputer=false;

difficultyBox.classList.add("hidden");

startGame();

};

// Computer Mode
computerBtn.onclick=()=>{

buttonSound.play().catch(()=>{});

difficultyBox.classList.remove("hidden");

};

// Difficulty
levelButtons.forEach(btn=>{

btn.onclick=()=>{

buttonSound.play().catch(()=>{});

difficulty=btn.dataset.level;

vsComputer=true;

difficultyBox.classList.add("hidden");

startGame();

};

});

// ========================================
// PART 2
// GAMEPLAY
// ========================================

// Add click event to every cell
cells.forEach((cell,index)=>{

cell.addEventListener("click",()=>{

if(!gameActive) return;

if(board[index]!="") return;

playMove(index,currentPlayer);

});

});


// --------------------
// Play Move
// --------------------

function playMove(index,player){

board[index]=player;

cells[index].textContent=player;

cells[index].classList.add(player.toLowerCase());

tapSound.currentTime=0;
tapSound.play().catch(()=>{});

if(navigator.vibrate){
navigator.vibrate(30);
}

// Check Win

if(checkWinner(player)){
return;
}

// Check Draw

if(checkDraw()){
return;
}

// Next Turn

if(vsComputer){

currentPlayer="O";

statusText.textContent="🤖 Computer Thinking...";

setTimeout(()=>{

computerMove();

},500);

}else{

currentPlayer=currentPlayer==="X"?"O":"X";

statusText.textContent="Player "+currentPlayer+" Turn";

}

}



// --------------------
// Check Winner
// --------------------

function checkWinner(player){

for(let pattern of winPatterns){

const[a,b,c]=pattern;

if(

board[a]===player &&
board[b]===player &&
board[c]===player

){

gameActive=false;

cells[a].classList.add("win");
cells[b].classList.add("win");
cells[c].classList.add("win

// ========================================
// PART 3
// COMPUTER AI
// ========================================

// Computer Move
function computerMove(){

if(!gameActive) return;

let move;

switch(difficulty){

case "easy":
move = randomMove();
break;

case "medium":
move = Math.random() < 0.5 ? bestMove() : randomMove();
break;

case "hard":
move = bestMove();
break;

default:
move = randomMove();

}

if(move === -1) return;

playComputerMove(move);

}

// ---------------------
// Place Computer Move
// ---------------------

function playComputerMove(index){

board[index] = "O";

cells[index].textContent = "O";

cells[index].classList.add("o");

tapSound.currentTime = 0;
tapSound.play().catch(()=>{});

if(checkWinner("O")) return;

if(checkDraw()) return;

currentPlayer = "X";

statusText.textContent = "Player X Turn";

}

// ---------------------
// Random Move
// ---------------------

function randomMove(){

let empty = [];

for(let i=0;i<board.length;i++){

if(board[i] === ""){

empty.push(i);

}

}

if(empty.length === 0){

return -1;

}

return empty[Math.floor(Math.random()*empty.length)];

}

// ---------------------
// Smart AI
// ---------------------

function bestMove(){

// Win if possible

for(let pattern of winPatterns){

const values = pattern.map(i=>board[i]);

if(values.filter(v=>v==="O").length===2 &&
values.includes("")){

return pattern[values.indexOf("")];

}

}

// Block Player

for(let pattern of winPatterns){

const values = pattern.map(i=>board[i]);

if(values.filter(v=>v==="X").length===2 &&
values.includes("")){

return pattern[values.indexOf("")];

}

}

// Take Center

if(board[4] === ""){

return 4;

}

// Take Corner

const corners=[0,2,6,8];

for                  

  // ========================================
// PART 4
// BUTTONS + CONFETTI
// ========================================

// Restart Match
restartBtn.addEventListener("click", () => {

buttonSound.currentTime = 0;
buttonSound.play().catch(()=>{});

startGame();

});

// Play Again
playAgainBtn.addEventListener("click", () => {

buttonSound.currentTime = 0;
buttonSound.play().catch(()=>{});

popup.classList.add("hidden");

startGame();

});

// Reset Score
resetBtn.addEventListener("click", () => {

buttonSound.currentTime = 0;
buttonSound.play().catch(()=>{});

xScore = 0;
oScore = 0;
drawScore = 0;

updateScores();

popup.classList.add("hidden");

startGame();

});

// ===========================
// Confetti
// ===========================

function createConfetti(){

const confetti = document.getElementById("confetti");

confetti.innerHTML = "";

for(let i=0;i<150;i++){

const piece = document.createElement("div");

piece.className = "confetti-piece";

piece.style.left = Math.random()*100 + "vw";

piece.style.animationDelay = Math.random()*2 + "s";

piece.style.background =
`hsl(${Math.random()*360},100%,50%)`;

piece.style.transform =
`rotate(${Math.random()*360}deg)`;

confetti.appendChild(piece);

}

setTimeout(()=>{

confetti.innerHTML="";

},3500);

}

// ===========================
// Close popup by clicking it
// ===========================

popup.addEventListener("click",()=>{

popup.classList.add("hidden");

});

// ===========================

  // ========================================
// PART 5
// FINAL EFFECTS + GAME SAFETY
// ========================================


// Safe sound function
function playSound(sound){

if(sound){

sound.currentTime = 0;

sound.play().catch(()=>{});

}

}


// Update status helper
function setStatus(message){

statusText.textContent = message;

}


// Prevent accidental page refresh during game
window.addEventListener("beforeunload",()=>{

localStorage.setItem(
"ticTacToeBoard",
JSON.stringify(board)
);

});


// Load previous scores
window.addEventListener("load",()=>{

updateScores();

});


// Keyboard support (PC)
document.addEventListener("keydown",(event)=>{

if(event.key==="r" || event.key==="R"){

startGame();

}

});


// Extra winning animation
function winningAnimation(){

popup.style.animation="popupShow .4s ease";

}


// Better popup function
function showPopup(title,text){

popupTitle.textContent = title;

popupText.textContent = text;

popup.classList.remove("hidden");

winningAnimation();

}


// Check game status
function gameMessage(){

if(!gameActive){

return;

}

if(vsComputer && currentPlayer==="O"){

setStatus("🤖 Computer Thinking...");

}else{

setStatus(
"Player "+currentPlayer+" Turn"
);

}

}


// Initialize

updateScores();

setStatus("Choose a Game Mode");
