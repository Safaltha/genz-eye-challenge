/* =========================================================
   ANIMAL SMASH CHALLENGE
   animal-smash.js
   ========================================================= */

"use strict";

/* =========================================================
   ELEMENTS
   ========================================================= */

const scoreElement = document.getElementById("score");
const comboElement = document.getElementById("combo");
const livesElement = document.getElementById("lives");
const timerElement = document.getElementById("timer");
const bestScoreElement = document.getElementById("bestScore");
const gameMessage = document.getElementById("gameMessage");

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const soundButton = document.getElementById("soundButton");
const backButton = document.getElementById("backButton");

const gameBoard = document.getElementById("gameBoard");
const hammer = document.getElementById("hammer");

const holes = Array.from(document.querySelectorAll(".hole"));

/* =========================================================
   GAME SETTINGS
   ========================================================= */

const GAME_DURATION = 60;
const STARTING_LIVES = 3;

const MIN_SPAWN_DELAY = 320;
const MAX_SPAWN_DELAY = 900;

const MIN_VISIBLE_TIME = 420;
const MAX_VISIBLE_TIME = 1250;

/* =========================================================
   ANIMAL DATABASE
   ========================================================= */

const ANIMALS = [
  {
    emoji: "🐰",
    points: 10,
    type: "normal"
  },
  {
    emoji: "🐹",
    points: 12,
    type: "normal"
  },
  {
    emoji: "🐭",
    points: 12,
    type: "normal"
  },
  {
    emoji: "🐿️",
    points: 15,
    type: "normal"
  },
  {
    emoji: "🦊",
    points: 20,
    type: "fast"
  },
  {
    emoji: "🐼",
    points: 20,
    type: "normal"
  },
  {
    emoji: "🐯",
    points: 25,
    type: "fast"
  },
  {
    emoji: "⭐",
    points: 50,
    type: "bonus"
  }
];

/* =========================================================
   GAME STATE
   ========================================================= */

let score = 0;
let combo = 0;
let lives = STARTING_LIVES;
let timeLeft = GAME_DURATION;

let gameRunning = false;
let gameOver = false;

let timerInterval = null;
let spawnTimeout = null;

let activeAnimals = new Map();

let difficulty = 1;

let soundEnabled = true;

let bestScore = loadBestScore();

/* =========================================================
   INITIAL DISPLAY
   ========================================================= */

updateScore();
updateCombo();
updateLives();
updateTimer();
updateBestScore();

/* =========================================================
   LOCAL STORAGE
   ========================================================= */

function loadBestScore() {
  try {
    const saved = localStorage.getItem("animalSmashBestScore");
    const parsed = Number(saved);

    if (Number.isFinite(parsed) && parsed >= 0) {
      return parsed;
    }
  } catch (error) {
    console.warn("Best score could not be loaded.");
  }

  return 0;
}

function saveBestScore() {
  try {
    localStorage.setItem(
      "animalSmashBestScore",
      String(bestScore)
    );
  } catch (error) {
    console.warn("Best score could not be saved.");
  }
}

/* =========================================================
   DISPLAY FUNCTIONS
   ========================================================= */

function updateScore() {
  scoreElement.textContent = score;
}

function updateCombo() {
  comboElement.textContent = combo;
}

function updateLives() {
  livesElement.textContent =
    "❤️".repeat(Math.max(0, lives)) +
    "🖤".repeat(Math.max(0, STARTING_LIVES - lives));
}

function updateTimer() {
  timerElement.textContent = timeLeft;
}

function updateBestScore() {
  bestScoreElement.textContent = bestScore;
}

/* =========================================================
   RANDOM HELPERS
   ========================================================= */

function randomInteger(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}

function randomItem(array) {
  return array[
    Math.floor(Math.random() * array.length)
  ];
}

/* =========================================================
   DIFFICULTY
   ========================================================= */

function calculateDifficulty() {
  const elapsed = GAME_DURATION - timeLeft;

  /*
    Difficulty grows continuously instead of using
    manually created levels.
  */

  difficulty =
    1 +
    Math.floor(elapsed / 5);

  return difficulty;
}

function getSpawnDelay() {
  calculateDifficulty();

  const reduction =
    Math.min(
      MAX_SPAWN_DELAY - MIN_SPAWN_DELAY,
      difficulty * 28
    );

  const maximum =
    Math.max(
      MIN_SPAWN_DELAY,
      MAX_SPAWN_DELAY - reduction
    );

  const minimum =
    Math.max(
      180,
      maximum - 260
    );

  return randomInteger(
    minimum,
    maximum
  );
}

function getVisibleTime() {
  calculateDifficulty();

  const reduction =
    Math.min(
      MAX_VISIBLE_TIME - MIN_VISIBLE_TIME,
      difficulty * 22
    );

  const maximum =
    Math.max(
      MIN_VISIBLE_TIME,
      MAX_VISIBLE_TIME - reduction
    );

  const minimum =
    Math.max(
      250,
      maximum - 400
    );

  return randomInteger(
    minimum,
    maximum
  );
}

/* =========================================================
   ANIMAL SELECTION
   ========================================================= */

function chooseAnimal() {

  /*
    Bonus animals become more common later.
  */

  const roll = Math.random();

  if (difficulty >= 6 && roll < 0.08) {
    return ANIMALS.find(
      animal => animal.type === "bonus"
    );
  }

  if (difficulty >= 3 && roll < 0.22) {
    return ANIMALS.find(
      animal => animal.type === "fast"
    );
  }

  return randomItem(
    ANIMALS.filter(
      animal => animal.type === "normal"
    )
  );
}

/* =========================================================
   FIND AVAILABLE HOLE
   ========================================================= */

function getAvailableHole() {

  const available = holes.filter(
    hole => !activeAnimals.has(hole)
  );

  if (available.length === 0) {
    return null;
  }

  return randomItem(available);
}

/* =========================================================
   START GAME
   ========================================================= */

function startGame() {

  if (gameRunning) {
    return;
  }

  clearGameTimers();

  clearAllAnimals();

  score = 0;
  combo = 0;
  lives = STARTING_LIVES;
  timeLeft = GAME_DURATION;

  difficulty = 1;

  gameRunning = true;
  gameOver = false;

  updateScore();
  updateCombo();
  updateLives();
  updateTimer();

  startButton.classList.add("hidden");
  restartButton.classList.add("hidden");

  gameMessage.textContent =
    "🐰 GO! Catch the animals!";

  timerInterval = setInterval(
    countdown,
    1000
  );

  scheduleNextSpawn();
}

/* =========================================================
   COUNTDOWN
   ========================================================= */

function countdown() {

  if (!gameRunning) {
    return;
  }

  timeLeft--;

  updateTimer();

  calculateDifficulty();

  if (timeLeft <= 0) {
    endGame("⏰ Time's up!");
  }
}

/* =========================================================
   SPAWN SCHEDULER
   ========================================================= */

function scheduleNextSpawn() {

  if (!gameRunning) {
    return;
  }

  clearTimeout(spawnTimeout);

  const delay = getSpawnDelay();

  spawnTimeout = setTimeout(
    () => {

      if (!gameRunning) {
        return;
      }

      spawnAnimal();

      scheduleNextSpawn();

    },
    delay
  );
}

/* =========================================================
   SPAWN ANIMAL
   ========================================================= */

function spawnAnimal() {

  if (!gameRunning) {
    return;
  }

  const hole = getAvailableHole();

  if (!hole) {
    return;
  }

  const animal = chooseAnimal();

  const animalElement =
    hole.querySelector(".animal");

  if (!animalElement) {
    return;
  }

  /*
    Store complete information for this animal.
  */

  const animalData = {
    animal,
    hit: false,
    timeout: null
  };

  animalElement.textContent =
    animal.emoji;

  animalElement.dataset.type =
    animal.type;

  animalElement.dataset.points =
    String(animal.points);

  hole.classList.remove("hit");

  /*
    Force browser to restart animation.
  */

  void hole.offsetWidth;

  hole.classList.add("active");

  activeAnimals.set(
    hole,
    animalData
  );

  const visibleTime =
    getVisibleTime();

  animalData.timeout =
    setTimeout(
      () => {

        if (!activeAnimals.has(hole)) {
          return;
        }

        /*
          Animal escaped.
        */

        activeAnimals.delete(hole);

        hole.classList.remove("active");

        animalElement.textContent = "";

        /*
          Missing an animal breaks combo.
        */

        combo = 0;

        updateCombo();

      },
      visibleTime
    );
}

/* =========================================================
   HIT ANIMAL
   ========================================================= */

function hitAnimal(hole, event) {

  if (!gameRunning) {
    return;
  }

  const animalData =
    activeAnimals.get(hole);

  if (!animalData) {
    /*
      Player hit an empty hole.
    */

    combo = 0;

    updateCombo();

    showMessage("💨 Miss!");

    playSound("miss");

    return;
  }

  if (animalData.hit) {
    return;
  }

  animalData.hit = true;

  clearTimeout(
    animalData.timeout
  );

  activeAnimals.delete(hole);

  const animal =
    animalData.animal;

  /*
    Combo increases with successful hits.
  */

  combo++;

  /*
    Combo multiplier:
    1–2 hits = ×1
    3–4 hits = ×2
    5–6 hits = ×3
    7+ hits = ×4
  */

  const multiplier =
    Math.min(
      4,
      Math.floor((combo - 1) / 2) + 1
    );

  const gained =
    animal.points * multiplier;

  score += gained;

  updateScore();
  updateCombo();

  hole.classList.add("hit");

  setTimeout(
    () => {
      hole.classList.remove("active");
      hole.classList.remove("hit");

      const animalElement =
        hole.querySelector(".animal");

      if (animalElement) {
        animalElement.textContent = "";
      }
    },
    130
  );

  createScorePopup(
    hole,
    `+${gained}`
  );

  showMessage(
    `${animal.emoji} +${gained}  🔥 ×${multiplier}`
  );

  playSound(
    animal.type === "bonus"
      ? "bonus"
      : "hit"
  );

  updateBestScoreIfNeeded();

  /*
    Occasionally spawn another target quickly
    at higher difficulty.
  */

  if (
    difficulty >= 5 &&
    Math.random() < 0.25
  ) {
    setTimeout(
      spawnAnimal,
      randomInteger(80, 180)
    );
  }
}

/* =========================================================
   EMPTY HOLE HIT
   ========================================================= */

function hitEmptyHole(hole) {

  if (!gameRunning) {
    return;
  }

  /*
    Empty-hole hits don't remove a life.
    They simply reset the combo.
  */

  combo = 0;

  updateCombo();

  showMessage("💨 Too early!");

  playSound("miss");

  createScorePopup(
    hole,
    "MISS",
    true
  );
}

/* =========================================================
   HOLE CLICK / TOUCH
   ========================================================= */

function handleHoleInteraction(event) {

  event.preventDefault();

  if (!gameRunning) {
    return;
  }

  const hole =
    event.currentTarget;

  /*
    Display hammer where the player touched/clicked.
  */

  showHammer(
    event.clientX,
    event.clientY
  );

  if (activeAnimals.has(hole)) {
    hitAnimal(
      hole,
      event
    );
  } else {
    hitEmptyHole(hole);
  }
}

/* =========================================================
   HAMMER
   ========================================================= */

function showHammer(clientX, clientY) {

  const rect =
    gameBoard.getBoundingClientRect();

  let x =
    clientX - rect.left;

  let y =
    clientY - rect.top;

  /*
    Keep hammer inside game board.
  */

  x = Math.max(
    20,
    Math.min(
      rect.width - 20,
      x
    )
  );

  y = Math.max(
    20,
    Math.min(
      rect.height - 20,
      y
    )
  );

  hammer.style.left =
    `${x}px`;

  hammer.style.top =
    `${y}px`;

  hammer.classList.remove("smash");

  void hammer.offsetWidth;

  hammer.classList.add("smash");
}

/* =========================================================
   SCORE POPUP
   ========================================================= */

function createScorePopup(
  hole,
  text,
  bad = false
) {

  const popup =
    document.createElement("div");

  popup.className =
    "score-popup";

  if (bad) {
    popup.classList.add("bad");
  }

  popup.textContent =
    text;

  const holeRect =
    hole.getBoundingClientRect();

  const boardRect =
    gameBoard.getBoundingClientRect();

  popup.style.left =
    `${holeRect.left - boardRect.left + holeRect.width / 2}px`;

  popup.style.top =
    `${holeRect.top - boardRect.top + holeRect.height * 0.25}px`;

  gameBoard.appendChild(popup);

  setTimeout(
    () => {
      popup.remove();
    },
    800
  );
}

/* =========================================================
   LIVES
   ========================================================= */

function loseLife() {

  if (!gameRunning) {
    return;
  }

  lives--;

  updateLives();

  combo = 0;

  updateCombo();

  playSound("miss");

  if (lives <= 0) {
    endGame("💥 Game Over!");
  }
}

/* =========================================================
   END GAME
   ========================================================= */

function endGame(message) {

  if (!gameRunning) {
    return;
  }

  gameRunning = false;
  gameOver = true;

  clearGameTimers();

  clearAllAnimals();

  updateBestScoreIfNeeded();

  gameMessage.textContent =
    `${message} Final score: ${score}`;

  startButton.classList.add("hidden");
  restartButton.classList.remove("hidden");

  playSound("gameover");
}

/* =========================================================
   CLEAR ANIMALS
   ========================================================= */

function clearAllAnimals() {

  activeAnimals.forEach(
    data => {
      clearTimeout(data.timeout);
    }
  );

  activeAnimals.clear();

  holes.forEach(
    hole => {

      hole.classList.remove(
        "active",
        "hit"
      );

      const animalElement =
        hole.querySelector(".animal");

      if (animalElement) {
        animalElement.textContent = "";
      }
    }
  );
}

/* =========================================================
   CLEAR TIMERS
   ========================================================= */

function clearGameTimers() {

  if (timerInterval !== null) {
    clearInterval(
      timerInterval
    );

    timerInterval = null;
  }

  if (spawnTimeout !== null) {
    clearTimeout(
      spawnTimeout
    );

    spawnTimeout = null;
  }
}

/* =========================================================
   BEST SCORE
   ========================================================= */

function updateBestScoreIfNeeded() {

  if (score > bestScore) {

    bestScore = score;

    saveBestScore();

    updateBestScore();
  }
}

/* =========================================================
   MESSAGE
   ========================================================= */

let messageTimeout = null;

function showMessage(text) {

  gameMessage.textContent =
    text;

  clearTimeout(
    messageTimeout
  );

  messageTimeout =
    setTimeout(
      () => {

        if (gameRunning) {
          gameMessage.textContent =
            "👀 Stay focused!";
        }

      },
      900
    );
}

/* =========================================================
   SOUND SYSTEM
   ========================================================= */

let audioContext = null;

function getAudioContext() {

  if (!audioContext) {

    try {

      audioContext =
        new (
          window.AudioContext ||
          window.webkitAudioContext
        )();

    } catch (error) {

      audioContext = null;

    }
  }

  return audioContext;
}

function playTone(
  frequency,
  duration,
  type = "sine",
  volume = 0.05
) {

  if (!soundEnabled) {
    return;
  }

  const context =
    getAudioContext();

  if (!context) {
    return;
  }

  try {

    if (context.state === "suspended") {
      context.resume();
    }

    const oscillator =
      context.createOscillator();

    const gain =
      context.createGain();

    oscillator.type =
      type;

    oscillator.frequency.value =
      frequency;

    gain.gain.setValueAtTime(
      0.0001,
      context.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      volume,
      context.currentTime + 0.01
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      context.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();

    oscillator.stop(
      context.currentTime + duration
    );

  } catch (error) {
    /*
      Audio errors should never stop the game.
    */
  }
}

function playSound(type) {

  if (!soundEnabled) {
    return;
  }

  switch (type) {

    case "hit":
      playTone(
        520,
        0.08,
        "square",
        0.045
      );
      break;

    case "bonus":
      playTone(
        880,
        0.12,
        "sine",
        0.06
      );

      setTimeout(
        () => {
          playTone(
            1100,
            0.12,
            "sine",
            0.05
          );
        },
        80
      );
      break;

    case "miss":
      playTone(
        170,
        0.12,
        "sawtooth",
        0.035
      );
      break;

    case "gameover":
      playTone(
        180,
        0.15,
        "triangle",
        0.05
      );

      setTimeout(
        () => {
          playTone(
            120,
            0.2,
            "triangle",
            0.045
          );
        },
        120
      );
      break;

    default:
      break;
  }
}

/* =========================================================
   SOUND BUTTON
   ========================================================= */

function toggleSound() {

  soundEnabled =
    !soundEnabled;

  soundButton.textContent =
    soundEnabled
      ? "🔊"
      : "🔇";

  soundButton.setAttribute(
    "aria-label",
    soundEnabled
      ? "Turn sound off"
      : "Turn sound on"
  );

  if (soundEnabled) {
    playTone(
      600,
      0.08,
      "sine",
      0.04
    );
  }
}

/* =========================================================
   BACK BUTTON
   ========================================================= */

function goBack() {

  if (gameRunning) {

    const shouldLeave =
      window.confirm(
        "Leave the game? Your current game will be lost."
      );

    if (!shouldLeave) {
      return;
    }
  }

  /*
    Works with your website when this page
    is opened normally.
  */

  if (
    document.referrer &&
    document.referrer !== window.location.href
  ) {

    window.history.back();

  } else {

    window.location.href =
      "index.html";
  }
}

/* =========================================================
   BUTTON EVENTS
   ========================================================= */

startButton.addEventListener(
  "click",
  startGame
);

restartButton.addEventListener(
  "click",
  startGame
);

soundButton.addEventListener(
  "click",
  toggleSound
);

backButton.addEventListener(
  "click",
  goBack
);

/* =========================================================
   HOLE EVENTS
   ========================================================= */

holes.forEach(
  hole => {

    hole.addEventListener(
      "pointerdown",
      handleHoleInteraction,
      {
        passive: false
      }
    );

  }
);

/* =========================================================
   PREVENT LONG PRESS / CONTEXT MENU
   ========================================================= */

gameBoard.addEventListener(
  "contextmenu",
  event => {
    event.preventDefault();
  }
);

/* =========================================================
   PAGE VISIBILITY
   ========================================================= */

document.addEventListener(
  "visibilitychange",
  () => {

    /*
      Don't allow a hidden browser tab to
      create strange duplicate timers.

      The current game simply continues when
      the player returns.
    */

    if (
      document.hidden &&
      gameRunning
    ) {
      gameMessage.textContent =
        "⏸️ Come back and keep playing!";
    }

  }
);

/* =========================================================
   INITIAL MESSAGE
   ========================================================= */

gameMessage.textContent =
  "Press START and get ready! 🐰🔨";

/* =========================================================
   END
   ========================================================= */
