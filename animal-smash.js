/* =========================================================
   🐾 ANIMAL SMASH
   Complete Game JavaScript
   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     ELEMENTS
  ========================================================= */

  const holes = [...document.querySelectorAll(".hole")];
  const animals = [...document.querySelectorAll(".animal")];

  const scoreEl = document.getElementById("score");
  const comboEl = document.getElementById("combo");
  const livesEl = document.getElementById("lives");
  const timerEl = document.getElementById("timer");
  const bestScoreEl = document.getElementById("bestScore");
  const messageEl = document.getElementById("gameMessage");

  const startButton = document.getElementById("startButton");
  const restartButton = document.getElementById("restartButton");
  const soundButton = document.getElementById("soundButton");
  const backButton = document.getElementById("backButton");
  const hammer = document.getElementById("hammer");

  /* =========================================================
     GAME SETTINGS
     ========================================================= */

  const SETTINGS = {
    maxHitsPerRound: 10,

    startingLives: 3,

    startingTime: 60,

    easy: {
      animalTime: 1250,
      spawnDelay: 650,
      bombChance: 0.10,
      animalCount: 1
    },

    normal: {
      animalTime: 1050,
      spawnDelay: 550,
      bombChance: 0.16,
      animalCount: 1
    },

    hard: {
      animalTime: 850,
      spawnDelay: 430,
      bombChance: 0.23,
      animalCount: 1
    }
  };

  /* =========================================================
     ANIMALS
     ========================================================= */

  const ANIMALS = [
    {
      emoji: "🐰",
      name: "Rabbit",
      points: 10
    },
    {
      emoji: "🐹",
      name: "Hamster",
      points: 12
    },
    {
      emoji: "🐿️",
      name: "Squirrel",
      points: 15
    },
    {
      emoji: "🦊",
      name: "Fox",
      points: 18
    },
    {
      emoji: "🐱",
      name: "Cat",
      points: 20
    },
    {
      emoji: "🐼",
      name: "Panda",
      points: 22
    },
    {
      emoji: "🐸",
      name: "Frog",
      points: 25
    }
  ];

  /* =========================================================
     SPECIAL ANIMALS
     One special animal appears every round.
     ========================================================= */

  const SPECIAL_ANIMALS = [
    {
      emoji: "🦄",
      name: "Golden Unicorn",
      points: 75
    },
    {
      emoji: "🐯",
      name: "Golden Tiger",
      points: 60
    },
    {
      emoji: "🦁",
      name: "Golden Lion",
      points: 70
    },
    {
      emoji: "🐲",
      name: "Dragon",
      points: 100
    }
  ];

  /* =========================================================
     GAME STATE
     ========================================================= */

  let score = 0;
  let combo = 0;
  let lives = SETTINGS.startingLives;

  let round = 1;
  let hitsThisRound = 0;

  let gameRunning = false;
  let soundEnabled = true;

  let difficulty = "normal";

  let gameTimer = SETTINGS.startingTime;
  let gameTimerInterval = null;

  let spawnTimeout = null;
  let animalTimeouts = [];

  let currentTargets = [];

  let specialAnimal = null;

  let bestScore = Number(
    localStorage.getItem("animalSmashBestScore") || 0
  );

  /* =========================================================
     LOAD BEST SCORE
     ========================================================= */

  if (bestScoreEl) {
    bestScoreEl.textContent = bestScore;
  }

  /* =========================================================
     RANDOM HELPERS
     ========================================================= */

  function randomNumber(max) {
    return Math.floor(Math.random() * max);
  }

  function randomAnimal() {
    return ANIMALS[randomNumber(ANIMALS.length)];
  }

  function randomSpecialAnimal() {
    return SPECIAL_ANIMALS[
      randomNumber(SPECIAL_ANIMALS.length)
    ];
  }

  function randomHole() {
    return randomNumber(holes.length);
  }

  /* =========================================================
     MESSAGE
     ========================================================= */

  function setMessage(text) {
    if (messageEl) {
      messageEl.textContent = text;
    }
  }

  /* =========================================================
     UI UPDATE
     ========================================================= */

  function updateUI() {

    if (scoreEl) {
      scoreEl.textContent = score;
    }

    if (comboEl) {
      comboEl.textContent = combo;
    }

    if (livesEl) {
      livesEl.textContent =
        "❤️".repeat(Math.max(0, lives)) +
        "🖤".repeat(Math.max(0, SETTINGS.startingLives - lives));
    }

    if (timerEl) {
      timerEl.textContent = gameTimer;
    }

    if (bestScoreEl) {
      bestScoreEl.textContent = bestScore;
    }
  }

  /* =========================================================
     SOUND
     ========================================================= */

  function playSound(type = "hit") {

    if (!soundEnabled) return;

    try {

      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!AudioContext) return;

      const ctx = new AudioContext();

      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      if (type === "hit") {
        oscillator.frequency.value = 520;
      }

      if (type === "special") {
        oscillator.frequency.value = 780;
      }

      if (type === "bomb") {
        oscillator.frequency.value = 150;
      }

      if (type === "miss") {
        oscillator.frequency.value = 240;
      }

      if (type === "level") {
        oscillator.frequency.value = 900;
      }

      if (type === "gameover") {
        oscillator.frequency.value = 120;
      }

      oscillator.type = "sine";

      gain.gain.setValueAtTime(
        0.12,
        ctx.currentTime
      );

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + 0.15
      );

      oscillator.start();

      oscillator.stop(
        ctx.currentTime + 0.15
      );

    } catch (error) {
      // Sound is optional.
    }
  }

  /* =========================================================
     CLEAR BOARD
     ========================================================= */

  function clearBoard() {

    holes.forEach((hole, index) => {

      hole.classList.remove(
        "active",
        "special",
        "bomb",
        "hit",
        "miss"
      );

      const animal = animals[index];

      if (animal) {
        animal.textContent = "";
        animal.removeAttribute("data-type");
      }

    });

    currentTargets = [];
  }

  /* =========================================================
     DIFFICULTY
     ========================================================= */

  function getDifficultySettings() {

    return SETTINGS[difficulty] || SETTINGS.normal;

  }

  /* =========================================================
     SPEED PROGRESSION
     ========================================================= */

  function getCurrentAnimalTime() {

    const settings = getDifficultySettings();

    const reduction =
      Math.min(
        500,
        (round - 1) * 35
      );

    return Math.max(
      350,
      settings.animalTime - reduction
    );
  }

  function getCurrentSpawnDelay() {

    const settings = getDifficultySettings();

    const reduction =
      Math.min(
        250,
        (round - 1) * 18
      );

    return Math.max(
      180,
      settings.spawnDelay - reduction
    );
  }

  function getBombChance() {

    const settings = getDifficultySettings();

    const increase =
      Math.min(
        0.12,
        (round - 1) * 0.012
      );

    return Math.min(
      0.40,
      settings.bombChance + increase
    );
  }

  /* =========================================================
     CREATE TARGET
     ========================================================= */

  function createTarget() {

    if (!gameRunning) return;

    clearBoard();

    const holeIndex = randomHole();

    const hole = holes[holeIndex];
    const animal = animals[holeIndex];

    if (!hole || !animal) return;

    /* -------------------------------------------------------
       Decide whether this is a bomb.
       Bombs become more common as rounds increase.
       ------------------------------------------------------- */

    const isBomb =
      Math.random() < getBombChance();

    /* -------------------------------------------------------
       Special animal.
       Exactly one special animal is available per round.
       ------------------------------------------------------- */

    const isSpecial =
      !isBomb &&
      specialAnimal !== null &&
      Math.random() < 0.22;

    if (isBomb) {

      animal.textContent = "💣";

      animal.setAttribute(
        "data-type",
        "bomb"
      );

      hole.classList.add("active", "bomb");

      currentTargets.push({
        holeIndex,
        type: "bomb",
        points: 0
      });

    } else {

      let chosenAnimal;

      if (isSpecial) {

        chosenAnimal = specialAnimal;

        specialAnimal = null;

        animal.textContent =
          chosenAnimal.emoji;

        hole.classList.add(
          "active",
          "special"
        );

        animal.setAttribute(
          "data-type",
          "special"
        );

        currentTargets.push({
          holeIndex,
          type: "special",
          points: chosenAnimal.points
        });

      } else {

        chosenAnimal = randomAnimal();

        animal.textContent =
          chosenAnimal.emoji;

        hole.classList.add("active");

        animal.setAttribute(
          "data-type",
          "animal"
        );

        currentTargets.push({
          holeIndex,
          type: "animal",
          points: chosenAnimal.points
        });
      }
    }

    /* -------------------------------------------------------
       Automatically hide target.
       ------------------------------------------------------- */

    const timeout = setTimeout(() => {

      if (!gameRunning) return;

      const targetStillThere =
        currentTargets.some(
          target =>
            target.holeIndex === holeIndex
        );

      if (targetStillThere) {

        /* Animal escaped */

        if (
          currentTargets.some(
            target =>
              target.holeIndex === holeIndex &&
              target.type !== "bomb"
          )
        ) {

          combo = 0;

          if (lives > 0) {
            lives--;
          }

          updateUI();

          setMessage(
            "😱 Too slow! The animal escaped!"
          );

          playSound("miss");

          if (lives <= 0) {
            endGame(
              "💔 You ran out of lives!"
            );
            return;
          }
        }

        clearBoard();

        scheduleNextTarget();

      }

    }, getCurrentAnimalTime());

    animalTimeouts.push(timeout);
  }

  /* =========================================================
     NEXT TARGET
     ========================================================= */

  function scheduleNextTarget() {

    if (!gameRunning) return;

    clearTimeout(spawnTimeout);

    spawnTimeout = setTimeout(() => {

      createTarget();

    }, getCurrentSpawnDelay());

  }

  /* =========================================================
     HIT TARGET
     ========================================================= */

  function hitTarget(holeIndex) {

    if (!gameRunning) return;

    const target =
      currentTargets.find(
        item =>
          item.holeIndex === holeIndex
      );

    if (!target) {

      /* -----------------------------------------------------
         Empty hole click.
         Does NOT remove a life.
         ----------------------------------------------------- */

      setMessage(
        "😅 Nothing there!"
      );

      return;
    }

    const hole = holes[holeIndex];

    /* -------------------------------------------------------
       BOMB
       ------------------------------------------------------- */

    if (target.type === "bomb") {

      hole.classList.add("hit");

      combo = 0;

      lives--;

      updateUI();

      setMessage(
        "💣 BOOM! You hit a bomb! -1 ❤️"
      );

      playSound("bomb");

      clearBoard();

      if (lives <= 0) {

        endGame(
          "💥 Too many bombs! Game Over!"
        );

        return;
      }

      scheduleNextTarget();

      return;
    }

    /* -------------------------------------------------------
       NORMAL ANIMAL
       ------------------------------------------------------- */

    if (target.type === "animal") {

      const gained =
        target.points +
        Math.min(combo * 2, 20);

      score += gained;

      combo++;

      hitsThisRound++;

      hole.classList.add("hit");

      updateUI();

      setMessage(
        `🎯 Great! +${gained} points`
      );

      playSound("hit");

      clearBoard();

      checkRoundComplete();

      return;
    }

    /* -------------------------------------------------------
       SPECIAL ANIMAL
       ------------------------------------------------------- */

    if (target.type === "special") {

      const gained =
        target.points +
        combo * 5;

      score += gained;

      combo++;

      hitsThisRound++;

      hole.classList.add(
        "hit",
        "special"
      );

      updateUI();

      setMessage(
        `🌟 SPECIAL ANIMAL! +${gained} points!`
      );

      playSound("special");

      clearBoard();

      checkRoundComplete();

      return;
    }
  }

  /* =========================================================
     CHECK ROUND
     ========================================================= */

  function checkRoundComplete() {

    if (
      hitsThisRound >=
      SETTINGS.maxHitsPerRound
    ) {

      nextRound();

      return;
    }

    scheduleNextTarget();
  }

  /* =========================================================
     NEXT ROUND
     ========================================================= */

  function nextRound() {

    clearBoard();

    round++;

    hitsThisRound = 0;

    specialAnimal =
      randomSpecialAnimal();

    playSound("level");

    setMessage(
      `🔥 ROUND ${round}! Speed increased! Find the special animal!`
    );

    scheduleNextTarget();
  }

  /* =========================================================
     GAME TIMER
     ========================================================= */

  function startGameTimer() {

    clearInterval(gameTimerInterval);

    gameTimer =
      SETTINGS.startingTime;

    updateUI();

    gameTimerInterval =
      setInterval(() => {

        if (!gameRunning) return;

        gameTimer--;

        updateUI();

        if (gameTimer <= 0) {

          endGame(
            "⏰ Time's up!"
          );

        }

      }, 1000);
  }

  /* =========================================================
     START GAME
     ========================================================= */

  function startGame() {

    stopEverything();

    score = 0;
    combo = 0;
    lives = SETTINGS.startingLives;

    round = 1;
    hitsThisRound = 0;

    gameRunning = true;

    specialAnimal =
      randomSpecialAnimal();

    updateUI();

    if (startButton) {
      startButton.classList.add("hidden");
    }

    if (restartButton) {
      restartButton.classList.add("hidden");
    }

    setMessage(
      "🐰 Get ready! Find the animals!"
    );

    startGameTimer();

    setTimeout(() => {

      if (!gameRunning) return;

      setMessage(
        "🎯 ROUND 1 — Smash the animals!"
      );

      createTarget();

    }, 500);
  }

  /* =========================================================
     END GAME
     ========================================================= */

  function endGame(reason = "Game Over!") {

    if (!gameRunning) return;

    gameRunning = false;

    stopEverything();

    if (score > bestScore) {

      bestScore = score;

      localStorage.setItem(
        "animalSmashBestScore",
        bestScore
      );

      setMessage(
        `🏆 NEW BEST SCORE: ${bestScore}!`
      );

    } else {

      setMessage(
        `${reason} Final Score: ${score}`
      );

    }

    if (restartButton) {
      restartButton.classList.remove("hidden");
    }

    if (startButton) {
      startButton.classList.remove("hidden");
    }

    updateUI();

    playSound("gameover");
  }

  /* =========================================================
     STOP EVERYTHING
     ========================================================= */

  function stopEverything() {

    clearInterval(gameTimerInterval);

    clearTimeout(spawnTimeout);

    animalTimeouts.forEach(
      timeout =>
        clearTimeout(timeout)
    );

    animalTimeouts = [];

    clearBoard();
  }

  /* =========================================================
     HAMMER EFFECT
     ========================================================= */

  function showHammer(event) {

    if (!hammer) return;

    hammer.classList.remove(
      "hammer-hit"
    );

    void hammer.offsetWidth;

    hammer.classList.add(
      "hammer-hit"
    );

    if (
      event &&
      typeof event.clientX === "number"
    ) {

      const rect =
        document.body.getBoundingClientRect();

      hammer.style.left =
        `${event.clientX - rect.left - 25}px`;

      hammer.style.top =
        `${event.clientY - rect.top - 25}px`;
    }
  }

  /* =========================================================
     HOLE CLICK EVENTS
     ========================================================= */

  holes.forEach((hole, index) => {

    hole.addEventListener(
      "click",
      event => {

        if (!gameRunning) return;

        showHammer(event);

        hitTarget(index);

      }
    );

  });

  /* =========================================================
     START BUTTON
     ========================================================= */

  if (startButton) {

    startButton.addEventListener(
      "click",
      () => {

        startGame();

      }
    );

  }

  /* =========================================================
     RESTART BUTTON
     ========================================================= */

  if (restartButton) {

    restartButton.addEventListener(
      "click",
      () => {

        startGame();

      }
    );

  }

  /* =========================================================
     SOUND BUTTON
     ========================================================= */

  if (soundButton) {

    soundButton.addEventListener(
      "click",
      () => {

        soundEnabled =
          !soundEnabled;

        soundButton.textContent =
          soundEnabled
            ? "🔊"
            : "🔇";

        if (soundEnabled) {
          playSound("hit");
        }

      }
    );

  }

  /* =========================================================
     BACK BUTTON
     ========================================================= */

  if (backButton) {

    backButton.addEventListener(
      "click",
      () => {

        window.location.href =
          "index.html";

      }
    );

  }

  /* =========================================================
     DIFFICULTY MENU
     
     If difficulty buttons are added later,
     this automatically supports:
     
     data-difficulty="easy"
     data-difficulty="normal"
     data-difficulty="hard"
     ========================================================= */

  document
    .querySelectorAll(
      "[data-difficulty]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const selected =
            button.dataset.difficulty;

          if (
            SETTINGS[selected]
          ) {

            difficulty = selected;

            document
              .querySelectorAll(
                "[data-difficulty]"
              )
              .forEach(btn =>
                btn.classList.remove(
                  "active"
                )
              );

            button.classList.add(
              "active"
            );

            setMessage(
              `🎮 ${selected.toUpperCase()} mode selected`
            );

          }

        }
      );

    });

  /* =========================================================
     KEYBOARD SUPPORT
     ========================================================= */

  document.addEventListener(
    "keydown",
    event => {

      if (!gameRunning) return;

      const key =
        Number(event.key);

      if (
        key >= 1 &&
        key <= 9
      ) {

        hitTarget(key - 1);

      }

    }
  );

  /* =========================================================
     INITIAL UI
     ========================================================= */

  updateUI();

  setMessage(
    "Get ready! Animals are coming! 🐰"
  );

  console.log(
    "🐾 Animal Smash loaded successfully!"
  );

})();
