/* ==========================================
   GEN Z MEMORY FLIP CHALLENGE
   PART 1
========================================== */

// Elements
const gameBoard = document.getElementById("gameBoard");
const difficulty = document.getElementById("difficulty");

const timer = document.getElementById("timer");
const movesText = document.getElementById("moves");
const matchesText = document.getElementById("matches");

const bestTime = document.getElementById("bestTime");
const bestMoves = document.getElementById("bestMoves");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const popup = document.getElementById("winPopup");
const playAgain = document.getElementById("playAgain");

const finalTime = document.getElementById("finalTime");
const finalMoves = document.getElementById("finalMoves");

// Icons
const allIcons = [
"🍎","🍌","🍇","🍓","🍉","🍒","🥝","🍍",
"🥥","🍑","🥕","🌽","🍕","🍔","🍟","🌭",
"🍩","🍪"
];

// Levels
const levels = {
    easy:8,
    medium:10,
    hard:18
};

// Game variables
let firstCard = null;
let secondCard = null;
let lockBoard = false;

let moves = 0;
let matches = 0;
let seconds = 0;

let timerInterval = null;
let gameStarted = false;

/* ==========================================
   GEN Z MEMORY FLIP CHALLENGE
   PART 2
========================================== */

/* =========================
   SHUFFLE ARRAY
========================= */

function shuffle(array){

    for(let i=array.length-1;i>0;i--){

        const j=Math.floor(Math.random()*(i+1));

        [array[i],array[j]]=[array[j],array[i]];

    }

    return array;

}

/* =========================
   START GAME
========================= */

function startGame(){

    clearInterval(timerInterval);

    gameStarted=false;
    firstCard=null;
    secondCard=null;
    lockBoard=false;

    moves=0;
    matches=0;
    seconds=0;

    timer.textContent="00:00";
    movesText.textContent="0";
    matchesText.textContent="0";

    popup.classList.add("hidden");

    game

/* ==========================================
   GEN Z MEMORY FLIP CHALLENGE
   PART 3
========================================== */

/* =========================
   FLIP CARD
========================= */

function flipCard(){

    if(lockBoard) return;

    if(this===firstCard) return;

    if(this.classList.contains("matched")) return;

    if(!gameStarted){
        gameStarted=true;
        startTimer();
    }

    this.classList.add("flip");

    if(!firstCard){

        firstCard=this;
        return;

    }

    secondCard=this;

    lockBoard=true;

    moves++;

    movesText.textContent=moves;

    checkMatch();

}

/* =========================
   CHECK MATCH
========================= */

function checkMatch(){

    if(firstCard.dataset.icon===secondCard.dataset.icon){

        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        matches++;

        matchesText.textContent=matches;

        resetTurn();

        checkWin();

    }else{

        firstCard.classList.add("wrong");
        secondCard.classList.add("wrong");

        setTimeout(()=>{

            firstCard.classList.remove("wrong");
            secondCard.classList.remove("wrong");

            firstCard.classList.remove("flip");
            secondCard.classList.remove("flip");

            resetTurn();

        },800);

    }

}

/* =========================
   RESET TURN
========================= */

function resetTurn(){

    firstCard=null;
    secondCard=null;
    lockBoard=false;

}

/* ==========================================
   GEN Z MEMORY FLIP CHALLENGE
   PART 4
========================================== */

/* =========================
   WIN CHECK
========================= */

function checkWin(){

    const totalPairs = levels[difficulty.value];

    if(matches !== totalPairs) return;

    clearInterval(timerInterval);

    finalTime.textContent = timer.textContent;
    finalMoves.textContent = moves;

    saveBestScore();

    popup.classList.remove("hidden");

}

/* =========================
   SAVE BEST SCORE
========================= */

function saveBestScore(){

    const level = difficulty.value;

    const timeKey = `memory_best_time_${level}`;
    const moveKey = `memory_best_moves_${level}`;

    const oldTime = Number(localStorage.getItem(timeKey));
    const oldMoves = Number(localStorage.getItem(moveKey));

    if(!oldTime || seconds < oldTime){
        localStorage.setItem(timeKey, seconds);
    }

    if(!oldMoves || moves < oldMoves){
        localStorage.setItem(moveKey, moves);
    }

    loadBestScore();

}

/* =========================
   LOAD BEST SCORE
========================= */

function loadBestScore(){

    const level = difficulty.value;

    const timeKey = `memory_best_time_${level}`;
    const moveKey = `memory_best_moves_${level}`;

    const savedTime = Number(localStorage.getItem(timeKey));
    const savedMoves = localStorage.getItem(moveKey);

    if(savedTime){

        const min = String(Math.floor(savedTime / 60)).padStart(2,"0");
        const sec = String(savedTime % 60).padStart(2,"0");

        bestTime.textContent = `${min}:${sec}`;

    }else{

        bestTime.textContent = "--:--";

    }

    if(savedMoves){

        bestMoves.textContent = savedMoves;

    }else{

        bestMoves.textContent = "--";

    }

}

/* =========================
   BUTTONS
========================= */
