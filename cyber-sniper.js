
// =====================================
// 🎯 CYBER SNIPER CHALLENGE
// CLEAN COMPLETE GAME ENGINE
// =====================================

"use strict";

// =====================================
// ELEMENTS
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


// =====================================
// GAME SETTINGS
// =====================================

const STARTING_LIVES = 3;
const STARTING_TIME = 30;

const NORMAL_TARGET_SIZE = 70;
const MIN_TARGET_SIZE = 35;

const NORMAL_TARGET_SPEED = 1500;
const MIN_TARGET_SPEED = 400;

const MOVE_INTERVAL = 700;


// =====================================
// GAME STATE
// =====================================

let score = 0;
let level = 1;
let lives = STARTING_LIVES;
let combo = 0;
let coins = 0;

let hits = 0;
let shots = 0;

let time = STARTING_TIME;

let playing = false;
let paused = false;

let targetSpeed = NORMAL_TARGET_SPEED;
let targetSize = NORMAL_TARGET_SIZE;

let currentTargetType = "normal";

let gameTimer = null;
let targetTimer = null;
let moveTimer = null;

let levelRewardGiven = 0;

let audioEnabled = true;


// =====================================
// RANDOM HELPERS
// =====================================

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}


// =====================================
// ACCURACY
// =====================================

function getAccuracy() {

    if (shots === 0) {
        return 100;
    }

    return Math.floor((hits / shots) * 100);
}


// =====================================
// UPDATE UI
// =====================================

function updateUI() {

    scoreText.textContent = score;

    levelText.textContent = level;

    livesText.textContent = lives;

    comboText.textContent = combo;

    coinsText.textContent = coins;

    accuracyText.textContent =
        getAccuracy() + "%";

    timeText.textContent =
        Math.max(0, time);

    // Progress toward next level.
    const levelScore =
        score % 100;

    progress.style.width =
        levelScore + "%";

}


// =====================================
// RESET CURRENT GAME
// =====================================

function resetGame() {

    clearAllTimers();

    score = 0;
    level = 1;
    lives = STARTING_LIVES;
    combo = 0;
    coins = 0;

    hits = 0;
    shots = 0;

    time = STARTING_TIME;

    targetSpeed =
        NORMAL_TARGET_SPEED;

    targetSize =
        NORMAL_TARGET_SIZE;

    levelRewardGiven = 0;

    currentTargetType =
        "normal";

    target.style.display =
        "none";

    resultBox.style.display =
        "none";

    pauseBtn.textContent =
        "⏸ Pause";

    updateUI();

}


// =====================================
// START GAME
// =====================================

function startGame() {

    resetGame();

    playing = true;
    paused = false;

    message.textContent =
        "🎯 Mission Started! Hit the targets!";

    modeText.textContent =
        "🎮 Normal Mode";

    startBtn.disabled = true;

    pauseBtn.disabled = false;

    restartBtn.disabled = false;

    startTimer();

    startMoving();

    spawnTarget();

}


// =====================================
// PAUSE / RESUME
// =====================================

pauseBtn.onclick = function () {

    if (!playing) {
        return;
    }

    paused = !paused;

    if (paused) {

        message.textContent =
            "⏸ Game Paused";

        pauseBtn.textContent =
            "▶ Resume";

        clearTimeout(targetTimer);

        clearInterval(moveTimer);

        target.style.display =
            "none";

    } else {

        message.textContent =
            "🔥 Mission Resumed!";

        pauseBtn.textContent =
            "⏸ Pause";

        spawnTarget();

        startMoving();

    }

};


// =====================================
// RESTART
// =====================================

restartBtn.onclick = function () {

    clearAllTimers();

    playing = false;
    paused = false;

    startGame();

};


// =====================================
// SPAWN TARGET
// =====================================

function spawnTarget() {

    if (!playing || paused) {
        return;
    }

    clearTimeout(targetTimer);

    target.style.display =
        "block";

    // Make sure target fits inside arena.
    const maxX =
        Math.max(
            0,
            arena.clientWidth - targetSize
        );

    const maxY =
        Math.max(
            0,
            arena.clientHeight - targetSize
        );

    const x =
        randomNumber(0, maxX);

    const y =
        randomNumber(0, maxY);

    target.style.left =
        x + "px";

    target.style.top =
        y + "px";

    target.style.width =
        targetSize + "px";

    target.style.height =
        targetSize + "px";


    // =================================
    // TARGET TYPE
    // =================================

    const chance =
        Math.random();

    if (level % 10 === 0) {

        currentTargetType =
            "boss";

        target.style.background =
            "radial-gradient(circle, gold, orange, red)";

        target.classList.add("boss-target");

    }

    else if (chance < 0.12) {

        currentTargetType =
            "bonus";

        target.style.background =
            "radial-gradient(circle, yellow, cyan)";

        target.classList.remove(
            "boss-target"
        );

    }

    else if (chance < 0.22) {

        currentTargetType =
            "trap";

        target.style.background =
            "radial-gradient(circle, black, red)";

        target.classList.remove(
            "boss-target"
        );

    }

    else {

        currentTargetType =
            "normal";

        target.style.background =
            "radial-gradient(circle, white, yellow, red)";

        target.classList.remove(
            "boss-target"
        );

    }

    target.dataset.type =
        currentTargetType;


    // =================================
    // AUTO MISS
    // =================================

    targetTimer =
        setTimeout(
            () => {

                if (
                    playing &&
                    !paused &&
                    target.style.display === "block"
                ) {

                    missTarget();

                }

            },
            targetSpeed
        );

}


// =====================================
// TARGET CLICK
// =====================================

target.onclick = function () {

    if (!playing || paused) {
        return;
    }

    shots++;

    clearTimeout(targetTimer);

    const type =
        currentTargetType;


    // =================================
    // TRAP
    // =================================

    if (type === "trap") {

        lives--;

        combo = 0;

        message.textContent =
            "💣 Trap Target! You lost a life!";

        playSound("wrong");

    }


    // =================================
    // BONUS
    // =================================

    else if (type === "bonus") {

        hits++;

        combo++;

        score += 30;

        coins += 5;

        message.textContent =
            "💎 BONUS TARGET! +30 POINTS +5 COINS";

        playSound("bonus");

    }


    // =================================
    // BOSS
    // =================================

    else if (type === "boss") {

        hits++;

        combo++;

        score += 100;

        coins += 10;

        message.textContent =
            "👑 BOSS DESTROYED! +100 POINTS +10 COINS";

        playSound("boss");

    }


    // =================================
    // NORMAL TARGET
    // =================================

    else {

        hits++;

        combo++;

        const points =
            10 + (combo * 2);

        score += points;

        coins++;

        message.textContent =
            "🎯 PERFECT SHOT! +" +
            points +
            " POINTS";

        playSound("hit");

    }


    // =================================
    // COMBO REWARD
    // =================================

    if (
        combo > 0 &&
        combo % 5 === 0
    ) {

        score += 50;

        coins += 5;

        message.textContent =
            "🔥 COMBO BONUS! +50 POINTS +5 COINS";

        playSound("combo");

    }


    // =================================
    // HIT EFFECT
    // =================================

    target.classList.add("hit");

    setTimeout(
        () => {

            target.classList.remove(
                "hit"
            );

        },
        250
    );

    target.style.display =
        "none";


    // =================================
    // LEVEL CHECK
    // =================================

    checkLevel();

    updateUI();


    // =================================
    // GAME OVER
    // =================================

    if (lives <= 0) {

        gameOver(
            "💔 You ran out of lives!"
        );

        return;

    }


    // =================================
    // NEXT TARGET
    // =================================

    spawnTarget();

};


// =====================================
// MISSED TARGET
// =====================================

function missTarget() {

    if (!playing || paused) {
        return;
    }

    target.style.display =
        "none";

    shots++;

    lives--;

    combo = 0;

    message.textContent =
        "❌ Missed! Focus your aim!";

    playSound("wrong");

    updateUI();


    if (lives <= 0) {

        gameOver(
            "💔 You missed too many targets!"
        );

        return;

    }

    spawnTarget();

}


// =====================================
// LEVEL SYSTEM
// =====================================

function checkLevel() {

    const newLevel =
        Math.floor(score / 100) + 1;


    if (newLevel > level) {

        level =
            newLevel;

        message.textContent =
            "🔥 LEVEL " +
            level +
            " UNLOCKED!";


        // Increase difficulty.
        targetSpeed =
            Math.max(
                MIN_TARGET_SPEED,
                NORMAL_TARGET_SPEED -
                ((level - 1) * 80)
            );


        targetSize =
            Math.max(
                MIN_TARGET_SIZE,
                NORMAL_TARGET_SIZE -
                ((level - 1) * 2)
            );


        // Level reward.
        if (
            level % 5 === 0 &&
            levelRewardGiven !== level
        ) {

            coins += 10;

            levelRewardGiven =
                level;

            message.textContent =
                "🎁 LEVEL REWARD! +10 COINS";

        }


        // Boss round.
        if (level % 10 === 0) {

            bossRound();

        } else {

            modeText.textContent =
                "🎮 Normal Mode";

        }

    }


    // Update progress bar.
    const progressValue =
        score % 100;

    progress.style.width =
        progressValue + "%";

}


// =====================================
// BOSS ROUND
// =====================================

function bossRound() {

    modeText.textContent =
        "👑 BOSS ROUND";

    message.textContent =
        "⚠️ BOSS INCOMING! HIT THE GIANT TARGET!";

    targetSize = 100;

    targetSpeed = 700;

}


// =====================================
// MOVING TARGET
// =====================================

function startMoving() {

    clearInterval(moveTimer);

    moveTimer =
        setInterval(
            () => {

                if (
                    !playing ||
                    paused ||
                    target.style.display !== "block"
                ) {

                    return;

                }

                const maxX =
                    Math.max(
                        0,
                        arena.clientWidth -
                        targetSize
                    );

                const maxY =
                    Math.max(
                        0,
                        arena.clientHeight -
                        targetSize
                    );

                const x =
                    randomNumber(
                        0,
                        maxX
                    );

                const y =
                    randomNumber(
                        0,
                        maxY
                    );

                target.style.left =
                    x + "px";

                target.style.top =
                    y + "px";

            },
            MOVE_INTERVAL
        );

}


// =====================================
// TIMER
// =====================================

function startTimer() {

    clearInterval(gameTimer);

    time =
        STARTING_TIME;

    updateUI();


    gameTimer =
        setInterval(
            () => {

                if (
                    !playing ||
                    paused
                ) {

                    return;

                }

                time--;

                updateUI();


                if (time <= 0) {

                    gameOver(
                        "⏰ TIME RAN OUT!"
                    );

                }

            },
            1000
        );

}


// =====================================
// GAME OVER
// =====================================

function gameOver(reason) {

    if (!playing) {
        return;
    }

    playing = false;

    paused = false;

    clearAllTimers();

    target.style.display =
        "none";

    startBtn.disabled = false;

    pauseBtn.disabled = true;

    resultBox.style.display =
        "block";


    const accuracy =
        getAccuracy();


    resultTitle.textContent =
        "🎮 Mission Complete";


    resultText.innerHTML =
        `
        ${reason}<br><br>
        ⭐ Score: ${score}<br>
        🎯 Accuracy: ${accuracy}%<br>
        🪙 Coins: ${coins}<br>
        🏆 Level: ${level}<br>
        🔥 Best Combo: ${combo}<br>
        🏅 Rank: ${getRank()}
        `;


    const newRecord =
        saveHighScore();


    if (newRecord) {

        resultText.innerHTML +=
            "<br>🎉 NEW HIGH SCORE!";

    }


    saveData();

}


// =====================================
// RANK SYSTEM
// =====================================

function getRank() {

    if (score >= 1000) {

        return "🏆 Cyber Legend";

    }

    if (score >= 500) {

        return "🔥 Elite Sniper";

    }

    if (score >= 200) {

        return "🎯 Expert Shooter";

    }

    if (score >= 100) {

        return "⭐ Skilled Sniper";

    }

    return "🌱 Rookie Sniper";

}


// =====================================
// CLEAR TIMERS
// =====================================

function clearAllTimers() {

    clearInterval(gameTimer);

    clearTimeout(targetTimer);

    clearInterval(moveTimer);

    gameTimer = null;

    targetTimer = null;

    moveTimer = null;

}


// =====================================
// SAVE PROGRESS
// =====================================

function saveData() {

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

function loadData() {

    const oldScore =
        localStorage.getItem(
            "cyberScore"
        );

    const oldLevel =
        localStorage.getItem(
            "cyberLevel"
        );

    const oldCoins =
        localStorage.getItem(
            "cyberCoins"
        );


    if (oldScore !== null) {

        score =
            Number(oldScore);

    }

    if (oldLevel !== null) {

        level =
            Number(oldLevel);

    }

    if (oldCoins !== null) {

        coins =
            Number(oldCoins);

    }


    updateUI();

}


// =====================================
// HIGH SCORE
// =====================================

function saveHighScore() {

    const best =
        Number(
            localStorage.getItem(
                "cyberBest"
            )
        ) || 0;


    if (score > best) {

        localStorage.setItem(
            "cyberBest",
            score
        );

        return true;

    }

    return false;

}


// =====================================
// SHOW HIGH SCORE
// =====================================

function showHighScore() {

    const best =
        Number(
            localStorage.getItem(
                "cyberBest"
            )
        ) || 0;


    message.innerHTML =
        "🏆 Best Score: " +
        best;

}


// =====================================
// SOUND SYSTEM
// =====================================

function playSound(type) {

    if (!audioEnabled) {
        return;
    }


    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if (!AudioContext) {
            return;
        }


        const context =
            new AudioContext();


        const oscillator =
            context.createOscillator();


        const gain =
            context.createGain();


        const frequencies = {

            hit: 600,

            bonus: 900,

            boss: 1100,

            combo: 750,

            wrong: 180

        };


        oscillator.type =
            "sine";


        oscillator.frequency.value =
            frequencies[type] || 500;


        oscillator.connect(gain);

        gain.connect(
            context.destination
        );


        gain.gain.setValueAtTime(
            0.08,
            context.currentTime
        );


        gain.gain.exponentialRampToValueAtTime(
            0.001,
            context.currentTime + 0.15
        );


        oscillator.start();


        oscillator.stop(
            context.currentTime + 0.15
        );

    }

    catch (error) {

        // Audio is optional.

    }

}


// =====================================
// START BUTTON
// =====================================

startBtn.onclick = function () {

    startGame();

};


// =====================================
// INITIAL STATE
// =====================================

pauseBtn.disabled = true;

restartBtn.disabled = false;

resultBox.style.display =
    "none";

message.textContent =
    "🎯 Cyber Sniper Ready. Press Start!";

loadData();

console.log(
    "🎯 Cyber Sniper Clean Engine Loaded!"
);
