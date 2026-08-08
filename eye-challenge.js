// --- GAME CONFIGURATION ---
const ROWS = 20;
const COLS = 20;
const MAX_WRONG_ATTEMPTS = 4; // Players get 4 tries before the answer is revealed

// --- DOM Elements ---
const boardEl = document.getElementById('game-board');
const scoreEl = document.getElementById('scoreDisplay');
const answerInput = document.getElementById('answerInput');
const submitBtn = document.getElementById('submitBtn');
const giveUpBtn = document.getElementById('giveUpBtn');
const messageBox = document.getElementById('messageBox');

// --- Game State ---
let currentScore = 0;
let correctAnswer = 0; 
let isRoundActive = true;
let wrongAttempts = 0;
let nextRoundTimeout = null;

// Helper: Random integer
function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// 1. Generate tricky pairs (Swap logic or Visual logic)
function generateNumberPair() {
    if (Math.random() < 0.5) {
        let base = getRandomInt(10, 98);
        let mainNum = base.toString().padStart(2, '0');
        let oddNum = mainNum[1] + mainNum[0]; // Swap digits (e.g., 25 -> 52)
        if (oddNum === mainNum) oddNum = (base + 1).toString().padStart(2, '0');
        return { mainNum, oddNum };
    } else {
        const pairs = [["6","8"], ["9","6"], ["2","5"], ["3","8"], ["7","1"]];
        const pair = pairs[getRandomInt(0, pairs.length - 1)];
        const flip = Math.random() > 0.5;
        return { mainNum: flip ? pair[0] : pair[1], oddNum: flip ? pair[1] : pair[0] };
    }
}

// 2. Build the 20x20 grid with the 0 trick
function generateNewGrid() {
    // Clear any pending timeouts from a previous round
    if (nextRoundTimeout) {
        clearTimeout(nextRoundTimeout);
        nextRoundTimeout = null;
    }

    isRoundActive = true;
    wrongAttempts = 0;
    messageBox.textContent = "";
    messageBox.style.color = "white";
    answerInput.value = "";
    answerInput.disabled = false;
    submitBtn.disabled = false;
    scoreEl.textContent = currentScore;

    const pair = generateNumberPair();
    const mainNum = pair.mainNum;
    const oddNum = pair.oddNum;
    
    // Randomly pick 0, 3, 4, or 5
    const possibleAnswers = [0, 3, 4, 5];
    correctAnswer = possibleAnswers[getRandomInt(0, possibleAnswers.length - 1)];

    let grid = Array(ROWS).fill().map(() => Array(COLS).fill(mainNum));

    // Only place odd numbers if answer is NOT 0
    let placed = 0;
    let attempts = 0;
    while (placed < correctAnswer && attempts < 1000) {
        let r = getRandomInt(0, ROWS - 1);
        let c = getRandomInt(0, COLS - 1);
        if (grid[r][c] !== oddNum) {
            grid[r][c] = oddNum;
            placed++;
        }
        attempts++;
    }

    // Render grid
    boardEl.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;
    boardEl.innerHTML = '';
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = grid[r][c];
            boardEl.appendChild(cell);
        }
    }
}

// 3. Check the answer
function checkAnswer() {
    if (!isRoundActive) return;
    let userInput = parseInt(answerInput.value);
    
    if (isNaN(userInput) || userInput < 0 || userInput > 5) {
        messageBox.style.color = "#facc15";
        messageBox.textContent = "Please enter a valid number (0 to 5).";
        return;
    }

    if (userInput === correctAnswer) {
        // CORRECT ANSWER
        messageBox.style.color = "#22c55e";
        messageBox.textContent = "✅ Correct! Moving to next round...";
        currentScore++;
        answerInput.disabled = true;
        submitBtn.disabled = true;
        isRoundActive = false;
        nextRoundTimeout = setTimeout(generateNewGrid, 1500);
    } else {
        // WRONG ANSWER
        wrongAttempts++;
        
        if (wrongAttempts >= MAX_WRONG_ATTEMPTS) {
            // REVEAL ANSWER (4th wrong guess)
            isRoundActive = false;
            answerInput.disabled = true;
            submitBtn.disabled = true;
            messageBox.style.color = "#f59e0b"; // Orange
            messageBox.innerHTML = `⏰ Too many wrong attempts! The correct answer was <strong>${correctAnswer}</strong>. Press the "<strong>Give Up</strong>" button to start the next round.`;
        } else {
            // Give them another chance
            messageBox.style.color = "#ef4444"; // Red
            messageBox.textContent = `❌ Wrong! (${wrongAttempts}/${MAX_WRONG_ATTEMPTS}) Try again, or press 'Give Up'.`;
            answerInput.focus();
        }
    }
}

// 4. Give Up / Skip (Also acts as "Next Round" after answer reveal)
function giveUp() {
    // Clear any pending auto-transition
    if (nextRoundTimeout) {
        clearTimeout(nextRoundTimeout);
        nextRoundTimeout = null;
    }

    if (!isRoundActive) {
        // If they used up attempts or got it right, just go straight to next round
        generateNewGrid();
        return;
    }

    // Standard manual give up
    messageBox.style.color = "#facc15";
    messageBox.textContent = "New round starting...";
    answerInput.disabled = true;
    submitBtn.disabled = true;
    isRoundActive = false;
    nextRoundTimeout = setTimeout(generateNewGrid, 800);
}

// --- EVENT LISTENERS ---
submitBtn.addEventListener('click', checkAnswer);
answerInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkAnswer(); });
giveUpBtn.addEventListener('click', giveUp);

// --- START THE GAME ---
generateNewGrid();
