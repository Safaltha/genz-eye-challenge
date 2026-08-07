/* ==========================================
   MEMORY FLIP CHALLENGE
   PART 1
========================================== */

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

/* =========================
   GAME ICONS
========================= */

const allIcons = [
"🍎","🍌","🍇","🍓","🍉","🍒",

  /* ==========================================
   MEMORY FLIP CHALLENGE
   PART 2
========================================== */

/* =========================
   FLIP CARD
========================= */

function flipCard(){

    if(lockBoard) return;

    if(this === firstCard) return;

    if(this.classList.contains("matched")) return;

    this.classList.add("flip");

    if(!firstCard){

        firstCard = this;

        return;

    }

    secondCard = this;

    lockBoard = true;

    moves++;

    movesText.textContent = moves;

    checkMatch();

}

/* =========================
   CHECK MATCH
========================= */

function checkMatch(){

    const matched =
        firstCard.dataset.icon === secondCard.dataset.icon;

    if(matched){

        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        matches++;

        matchesText.textContent = matches;

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

    firstCard = null;

    secondCard = null;

    lockBoard = false;

}

/* =========================
   TIMER
========================= */

function startTimer(){

    clearInterval(timerInterval);

    timerInterval = setInterval(()=>{

        seconds++;

        const min = String(Math.floor(seconds/60)).padStart(2,"0");
        const sec = String(seconds%60).padStart(2,"0");

        timer.textContent = `${min}:${sec}`;

    },1000);

}
/* ==========================================
   MEMORY FLIP CHALLENGE
   PART 3
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
   BEST SCORE
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
   CHANGE DIFFICULTY
========================= */

difficulty.addEventListener("change", startGame);

/* =========================
   START GAME AUTOMATICALLY
========================= */

window.addEventListener("load", startGame);
