
/* =========================================================
   🐾 ANIMAL SMASH
   Target-based Round System
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

  const roundEl = document.getElementById("round");
  const targetAnimalEl = document.getElementById("targetAnimal");
  const targetProgressEl = document.getElementById("targetProgress");
  const specialAnimalEl = document.getElementById("specialAnimal");

  const messageEl = document.getElementById("gameMessage");

  const startButton = document.getElementById("startButton");
  const restartButton = document.getElementById("restartButton");
  const difficultyButton =
    document.getElementById("difficultyButton");

  const difficultyPanel =
    document.getElementById("difficultyPanel");

  const objectivePanel =
    document.getElementById("objectivePanel");

  const soundButton =
    document.getElementById("soundButton");

  const backButton =
    document.getElementById("backButton");

  /* =========================================================
     SETTINGS
  ========================================================= */

  const MAX_HITS_PER_ROUND = 10;

  const STARTING_LIVES = 3;

  const DIFFICULTY = {

    easy: {
      time: 15,
      animalTime: 1350,
      delay: 550,
      bombChance: 0.08
    },

    normal: {
      time: 12,
      animalTime: 1100,
      delay: 430,
      bombChance: 0.15
    },

    hard: {
      time: 10,
      animalTime: 900,
      delay: 330,
      bombChance: 0.23
    }

  };

  /* =========================================================
     ANIMALS
  ========================================================= */

  const ANIMALS = [

    {
      emoji: "🐰",
      name: "RABBIT",
      points: 10
    },

    {
      emoji: "🐱",
      name: "CAT",
      points: 12
    },

    {
      emoji: "🐸",
      name: "FROG",
      points: 14
    },

    {
      emoji: "🦊",
      name: "FOX",
      points: 16
    },

    {
      emoji: "🐼",
      name: "PANDA",
      points: 18
    },

    {
      emoji: "🐹",
      name: "HAMSTER",
      points: 12
    },

    {
      emoji: "🐿️",
      name: "SQUIRREL",
      points: 15
    },

    {
      emoji: "🐯",
      name: "TIGER",
      points: 20
    },

    {
      emoji: "🦁",
      name: "LION",
      points: 22
    },

    {
      emoji: "🐵",
      name: "MONKEY",
      points: 17
    }

  ];

  /* =========================================================
     SPECIAL ANIMALS
  ========================================================= */

  const SPECIAL_ANIMALS = [

    {
      emoji: "🦄",
      name: "UNICORN",
      points: 75
    },

    {
      emoji: "🐲",
      name: "DRAGON",
      points: 100
    },

    {
      emoji: "🦅",
      name: "EAGLE",
      points: 80
    },

    {
      emoji: "🐉",
      name: "GOLDEN DRAGON",
      points: 120
    }

  ];

  /* =========================================================
     GAME STATE
  ========================================================= */

  let score = 0;

  let combo = 0;

  let lives = STARTING_LIVES;

  let round = 1;

  let hitsThisRound = 0;

  let targetAnimal = null;

  let specialAnimal = null;

  let currentTarget = null;

  let gameRunning = false;

  let soundEnabled = true;

  let difficulty = "normal";

  let timeLeft = 0;

  let timerInterval = null;

  let spawnTimeout = null;

  let hideTimeout = null;

  let bestScore =
    Number(
      localStorage.getItem(
        "animalSmashBestScore"
      )
    ) || 0;

  /* =========================================================
     INITIAL BEST SCORE
  ========================================================= */

  if (bestScoreEl) {
    bestScoreEl.textContent = bestScore;
  }

  /* =========================================================
     RANDOM
  ========================================================= */

  function randomItem(array) {

    return array[
      Math.floor(
        Math.random() * array.length
      )
    ];

  }

  /* =========================================================
     MESSAGE
  ========================================================= */

  function message(text) {

    if (messageEl) {
      messageEl.textContent = text;
    }

  }

  /* =========================================================
     UPDATE UI
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
        "❤️".repeat(
          Math.max(0, lives)
        ) +
        "🖤".repeat(
          Math.max(
            0,
            STARTING_LIVES - lives
          )
        );

    }

    if (timerEl) {
      timerEl.textContent =
        Math.max(0, timeLeft);
    }

    if (roundEl) {
      roundEl.textContent = round;
    }

    if (bestScoreEl) {
      bestScoreEl.textContent =
        bestScore;
    }

    if (targetAnimalEl && targetAnimal) {

      targetAnimalEl.textContent =
        `${targetAnimal.emoji} ${targetAnimal.name}`;

    }

    if (targetProgressEl) {

      targetProgressEl.textContent =
        `${hitsThisRound} / ${MAX_HITS_PER_ROUND} HITS`;

    }

    if (specialAnimalEl && specialAnimal) {

      specialAnimalEl.textContent =
        specialAnimal.emoji;

    }

  }

  /* =========================================================
     SOUND
  ========================================================= */

  function playSound(type) {

    if (!soundEnabled) return;

    try {

      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!AudioContext) return;

      const context =
        new AudioContext();

      const oscillator =
        context.createOscillator();

      const gain =
        context.createGain();

      oscillator.connect(gain);
      gain.connect(context.destination);

      const frequencies = {

        hit: 520,

        special: 850,

        wrong: 230,

        bomb: 100,

        level: 950,

        gameover: 120

      };

      oscillator.frequency.value =
        frequencies[type] || 500;

      oscillator.type = "sine";

      gain.gain.setValueAtTime(
        0.08,
        context.currentTime
      );

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        context.currentTime + 0.16
      );

      oscillator.start();

      oscillator.stop(
        context.currentTime + 0.16
      );

    } catch (error) {}

  }

  /* =========================================================
     CLEAR BOARD
  ========================================================= */

  function clearBoard() {

    clearTimeout(hideTimeout);

    currentTarget = null;

    holes.forEach((hole, index) => {

      hole.classList.remove(
        "active",
        "special",
        "bomb",
        "hit",
        "miss"
      );

      const animal =
        animals[index];

      if (animal) {

        animal.textContent = "";

        animal.removeAttribute(
          "data-type"
        );

      }

    });

  }

  /* =========================================================
     ROUND TARGET
  ========================================================= */

  function chooseRoundAnimals() {

    targetAnimal =
      randomItem(ANIMALS);

    specialAnimal =
      randomItem(SPECIAL_ANIMALS);

    hitsThisRound = 0;

    updateUI();

  }

  /* =========================================================
     CURRENT SPEED
  ========================================================= */

  function getSettings() {

    return (
      DIFFICULTY[difficulty] ||
      DIFFICULTY.normal
    );

  }

  function getAnimalTime() {

    const settings =
      getSettings();

    /*
       Every round becomes faster.
       It never becomes impossibly fast.
    */

    const reduction =
      Math.min(
        550,
        (round - 1) * 35
      );

    return Math.max(
      350,
      settings.animalTime - reduction
    );

  }

  function getSpawnDelay() {

    const settings =
      getSettings();

    const reduction =
      Math.min(
        250,
        (round - 1) * 15
      );

    return Math.max(
      150,
      settings.delay - reduction
    );

  }

  function getBombChance() {

    const settings =
      getSettings();

    const increase =
      Math.min(
        0.18,
        (round - 1) * 0.012
      );

    return Math.min(
      0.45,
      settings.bombChance + increase
    );

  }

  /* =========================================================
     SPAWN TARGET
  ========================================================= */

  function spawnTarget() {

    if (!gameRunning) return;

    clearBoard();

    const holeIndex =
      Math.floor(
        Math.random() * holes.length
      );

    const hole =
      holes[holeIndex];

    const animal =
      animals[holeIndex];

    if (!hole || !animal) return;

    /* =====================================================
       BOMB DECISION

       More bombs gradually appear.
       ===================================================== */

    const isBomb =
      Math.random() < getBombChance();

    if (isBomb) {

      animal.textContent = "💣";

      animal.dataset.type =
        "bomb";

      hole.classList.add(
        "active",
        "bomb"
      );

      currentTarget = {

        holeIndex,
        type: "bomb"

      };

    }

    /* =====================================================
       SPECIAL ANIMAL

       Special animal appears occasionally.
       ===================================================== */

    else if (
      Math.random() < 0.15
    ) {

      animal.textContent =
        specialAnimal.emoji;

      animal.dataset.type =
        "special";

      hole.classList.add(
        "active",
        "special"
      );

      currentTarget = {

        holeIndex,
        type: "special",
        points:
          specialAnimal.points

      };

    }

    /* =====================================================
       NORMAL TARGET / DISTRACTOR
       ===================================================== */

    else {

      /*
         Most animals are distractions.
         The target has a higher chance
         of appearing so the game stays fun.
      */

      const isTarget =
        Math.random() < 0.60;

      const chosen =
        isTarget
          ? targetAnimal
          : randomItem(
              ANIMALS.filter(
                item =>
                  item.name !==
                  targetAnimal.name
              )
            );

      animal.textContent =
        chosen.emoji;

      animal.dataset.type =
        chosen.name ===
        targetAnimal.name
          ? "target"
          : "wrong";

      hole.classList.add(
        "active"
      );

      currentTarget = {

        holeIndex,

        type:
          chosen.name ===
          targetAnimal.name
            ? "target"
            : "wrong",

        animal: chosen

      };

    }

    /* =====================================================
       AUTO HIDE
       ===================================================== */

    hideTimeout =
      setTimeout(() => {

        if (!gameRunning) return;

        /*
           If the player didn't hit it:
           the target escaped.
        */

        if (currentTarget) {

          if (
            currentTarget.type ===
            "target"
          ) {

            combo = 0;

            message(
              "😱 Too slow! Target escaped!"
            );

            playSound("wrong");

          }

        }

        clearBoard();

        scheduleNext();

      }, getAnimalTime());

  }

  /* =========================================================
     NEXT SPAWN
  ========================================================= */

  function scheduleNext() {

    if (!gameRunning) return;

    clearTimeout(spawnTimeout);

    spawnTimeout =
      setTimeout(() => {

        spawnTarget();

      }, getSpawnDelay());

  }

  /* =========================================================
     HIT HOLE
  ========================================================= */

  function hitHole(index) {

    if (!gameRunning) return;

    if (
      !currentTarget ||
      currentTarget.holeIndex !== index
    ) {

      message(
        "😅 Empty hole!"
      );

      return;

    }

    const hole =
      holes[index];

    /* =====================================================
       BOMB
       ===================================================== */

    if (
      currentTarget.type ===
      "bomb"
    ) {

      hole.classList.add(
        "hit"
      );

      playSound("bomb");

      /*
         Bomb = instant game over.
      */

      message(
        "💣 BOOM! You smashed a bomb! GAME OVER!"
      );

      endGame();

      return;

    }

    /* =====================================================
       WRONG ANIMAL
       ===================================================== */

    if (
      currentTarget.type ===
      "wrong"
    ) {

      combo = 0;

      hole.classList.add(
        "miss"
      );

      playSound("wrong");

      message(
        `❌ Wrong animal! Find ${targetAnimal.emoji} ${targetAnimal.name}!`
      );

      updateUI();

      clearBoard();

      scheduleNext();

      return;

    }

    /* =====================================================
       SPECIAL ANIMAL
       ===================================================== */

    if (
      currentTarget.type ===
      "special"
    ) {

      const bonus =
        specialAnimal.points +
        combo * 5;

      score += bonus;

      combo++;

      hole.classList.add(
        "hit",
        "special"
      );

      playSound("special");

      message(
        `🌟 SPECIAL! +${bonus} BONUS POINTS!`
      );

      updateUI();

      clearBoard();

      scheduleNext();

      return;

    }

    /* =====================================================
       CORRECT TARGET
       ===================================================== */

    if (
      currentTarget.type ===
      "target"
    ) {

      /*
         Combo bonus
      */

      const points =
        targetAnimal.points +
        Math.min(
          combo * 2,
          20
        );

      score += points;

      combo++;

      hitsThisRound++;

      hole.classList.add(
        "hit"
      );

      playSound("hit");

      message(
        `🎯 PERFECT! +${points} points`
      );

      updateUI();

      clearBoard();

      /* ===================================================
         ROUND COMPLETE
         =================================================== */

      if (
        hitsThisRound >=
        MAX_HITS_PER_ROUND
      ) {

        completeRound();

        return;

      }

      scheduleNext();

    }

  }

  /* =========================================================
     COMPLETE ROUND
  ========================================================= */

  function completeRound() {

    clearBoard();

    playSound("level");

    message(
      `🔥 ROUND ${round} COMPLETE! Get ready for Round ${round + 1}!`
    );

    round++;

    /*
       New target every round.
    */

    chooseRoundAnimals();

    updateUI();

    setTimeout(() => {

      if (!gameRunning) return;

      message(
        `🎯 ROUND ${round}: Smash ${targetAnimal.emoji} ${targetAnimal.name}!`
      );

      spawnTarget();

    }, 700);

  }

  /* =========================================================
     TIMER
  ========================================================= */

  function startTimer() {

    clearInterval(timerInterval);

    const settings =
      getSettings();

    timeLeft =
      settings.time;

    updateUI();

    timerInterval =
      setInterval(() => {

        if (!gameRunning) return;

        timeLeft--;

        updateUI();

        if (timeLeft <= 0) {

          message(
            "⏰ TIME'S UP!"
          );

          endGame();

        }

      }, 1000);

  }

  /* =========================================================
     START GAME
  ========================================================= */

  function startGame() {

    stopGameLoops();

    clearBoard();

    score = 0;

    combo = 0;

    lives =
      STARTING_LIVES;

    round = 1;

    gameRunning = true;

    chooseRoundAnimals();

    if (difficultyPanel) {

      difficultyPanel.classList.add(
        "hidden"
      );

    }

    if (objectivePanel) {

      objectivePanel.classList.remove(
        "hidden"
      );

    }

    if (startButton) {

      startButton.classList.add(
        "hidden"
      );

    }

    if (restartButton) {

      restartButton.classList.add(
        "hidden"
      );

    }

    if (difficultyButton) {

      difficultyButton.classList.remove(
        "hidden"
      );

    }

    updateUI();

    message(
      `🎯 ROUND 1: Smash ${targetAnimal.emoji} ${targetAnimal.name}!`
    );

    startTimer();

    setTimeout(() => {

      if (gameRunning) {

        spawnTarget();

      }

    }, 500);

  }

  /* =========================================================
     END GAME
  ========================================================= */

  function endGame() {

    if (!gameRunning) return;

    gameRunning = false;

    stopGameLoops();

    clearBoard();

    playSound("gameover");

    if (score > bestScore) {

      bestScore = score;

      localStorage.setItem(
        "animalSmashBestScore",
        bestScore
      );

      message(
        `🏆 NEW BEST SCORE! ${score} points!`
      );

    } else {

      message(
        `💥 GAME OVER! Score: ${score} | Round: ${round}`
      );

    }

    if (restartButton) {

      restartButton.classList.remove(
        "hidden"
      );

    }

    if (startButton) {

      startButton.classList.remove(
        "hidden"
      );

    }

    updateUI();

  }

  /* =========================================================
     STOP LOOPS
  ========================================================= */

  function stopGameLoops() {

    clearInterval(
      timerInterval
    );

    clearTimeout(
      spawnTimeout
    );

    clearTimeout(
      hideTimeout
    );

    timerInterval = null;

    spawnTimeout = null;

    hideTimeout = null;

  }

  /* =========================================================
     DIFFICULTY BUTTONS
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
            !DIFFICULTY[selected]
          ) return;

          difficulty =
            selected;

          document
            .querySelectorAll(
              "[data-difficulty]"
            )
            .forEach(btn => {

              btn.classList.remove(
                "active"
              );

            });

          button.classList.add(
            "active"
          );

          message(
            `🎮 ${selected.toUpperCase()} selected! Press START GAME.`
          );

        }
      );

    });

  /* =========================================================
     START
  ========================================================= */

  if (startButton) {

    startButton.addEventListener(
      "click",
      startGame
    );

  }

  /* =========================================================
     RESTART
  ========================================================= */

  if (restartButton) {

    restartButton.addEventListener(
      "click",
      startGame
    );

  }

  /* =========================================================
     CHANGE DIFFICULTY
  ========================================================= */

  if (difficultyButton) {

    difficultyButton.addEventListener(
      "click",
      () => {

        stopGameLoops();

        gameRunning = false;

        clearBoard();

        if (objectivePanel) {

          objectivePanel.classList.add(
            "hidden"
          );

        }

        if (difficultyPanel) {

          difficultyPanel.classList.remove(
            "hidden"
          );

        }

        if (startButton) {

          startButton.classList.remove(
            "hidden"
          );

        }

        if (restartButton) {

          restartButton.classList.add(
            "hidden"
          );

        }

        difficultyButton.classList.add(
          "hidden"
        );

        message(
          "🎮 Choose your difficulty!"
        );

      }
    );

  }

  /* =========================================================
     SOUND
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
     BACK
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
     HOLE CLICK
  ========================================================= */

  holes.forEach(
    (hole, index) => {

      hole.addEventListener(
        "click",
        () => {

          hitHole(index);

        }
      );

    }
  );

  /* =========================================================
     KEYBOARD SUPPORT
  ========================================================= */

  document.addEventListener(
    "keydown",
    event => {

      if (!gameRunning) return;

      const number =
        Number(event.key);

      if (
        number >= 1 &&
        number <= 9
      ) {

        hitHole(
          number - 1
        );

      }

    }
  );

  /* =========================================================
     INITIAL STATE
  ========================================================= */

  updateUI();

  message(
    "Choose a difficulty to begin! 🎯"
  );

  console.log(
    "🐾 Animal Smash — Target System Loaded!"
  );

})();
