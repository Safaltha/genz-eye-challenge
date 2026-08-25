
/* =========================================================
   🐾 ANIMAL SMASH
   ADVANCED MULTI-TARGET GAME SYSTEM

   Features:
   - Multiple animals at once
   - Guaranteed target appearances
   - Dynamic time
   - Combo
   - Bombs
   - Special animals
   - Ghost scare events
   - Animated hammer
   - Increasing difficulty
========================================================= */

(() => {

  "use strict";


  /* =========================================================
     ELEMENTS
  ========================================================= */

  const holes =
    [...document.querySelectorAll(".hole")];

  const animals =
    [...document.querySelectorAll(".animal")];

  const scoreEl =
    document.getElementById("score");

  const comboEl =
    document.getElementById("combo");

  const livesEl =
    document.getElementById("lives");

  const timerEl =
    document.getElementById("timer");

  const bestScoreEl =
    document.getElementById("bestScore");

  const roundEl =
    document.getElementById("round");

  const targetAnimalEl =
    document.getElementById("targetAnimal");

  const targetProgressEl =
    document.getElementById("targetProgress");

  const specialAnimalEl =
    document.getElementById("specialAnimal");

  const messageEl =
    document.getElementById("gameMessage");

  const startButton =
    document.getElementById("startButton");

  const restartButton =
    document.getElementById("restartButton");

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

  const hammer =
    document.getElementById("hammer");

  const gameBoard =
    document.getElementById("gameBoard");

  const scareOverlay =
    document.getElementById("scareOverlay");

  const scareEmoji =
    document.getElementById("scareEmoji");


  /* =========================================================
     GAME SETTINGS
  ========================================================= */

  const HITS_REQUIRED = 10;

  const START_TIME = 10;

  const MAX_TIME = 30;

  const STARTING_LIVES = 3;


  const DIFFICULTY = {

    easy: {

      simultaneous: 3,

      minObjects: 3,

      maxObjects: 4,

      waveTime: 1450,

      nextDelay: 300,

      targetChance: .62,

      bombChance: .08,

      wrongPenalty: .4,

      correctTime: 2.2,

      specialChance: .12,

      scareChance: .04

    },

    normal: {

      simultaneous: 4,

      minObjects: 3,

      maxObjects: 5,

      waveTime: 1100,

      nextDelay: 180,

      targetChance: .58,

      bombChance: .14,

      wrongPenalty: .6,

      correctTime: 2.0,

      specialChance: .12,

      scareChance: .07

    },

    hard: {

      simultaneous: 5,

      minObjects: 4,

      maxObjects: 6,

      waveTime: 820,

      nextDelay: 110,

      targetChance: .53,

      bombChance: .20,

      wrongPenalty: .8,

      correctTime: 1.7,

      specialChance: .10,

      scareChance: .10

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
    },

    {
      emoji: "🐨",
      name: "KOALA",
      points: 16
    },

    {
      emoji: "🦝",
      name: "RACCOON",
      points: 19
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
     SCARE EVENTS
  ========================================================= */

  const SCARE_EVENTS = [

    "👻",

    "😱",

    "💀",

    "👹",

    "🤡",

    "😈"

  ];


  /* =========================================================
     GAME STATE
  ========================================================= */

  let score = 0;

  let combo = 0;

  let lives = STARTING_LIVES;

  let round = 1;

  let hitsThisRound = 0;

  let timeLeft = START_TIME;

  let targetAnimal = null;

  let specialAnimal = null;

  let gameRunning = false;

  let soundEnabled = true;

  let difficulty = "normal";

  let timerInterval = null;

  let waveTimeout = null;

  let hideTimeout = null;

  let scareTimeout = null;

  let activeObjects = new Map();

  let bestScore =
    Number(
      localStorage.getItem(
        "animalSmashBestScore"
      )
    ) || 0;


  /* =========================================================
     BASIC HELPERS
  ========================================================= */

  function randomItem(array) {

    return array[
      Math.floor(
        Math.random() * array.length
      )
    ];

  }


  function randomInt(min, max) {

    return Math.floor(
      Math.random() *
      (max - min + 1)
    ) + min;

  }


  function shuffle(array) {

    return [...array].sort(
      () => Math.random() - .5
    );

  }


  function message(text) {

    if (messageEl) {

      messageEl.textContent = text;

    }

  }


  function settings() {

    return DIFFICULTY[difficulty];

  }


  /* =========================================================
     TIME
  ========================================================= */

  function addTime(amount) {

    timeLeft =
      Math.min(
        MAX_TIME,
        timeLeft + amount
      );

    updateUI();

  }


  function removeTime(amount) {

    timeLeft =
      Math.max(
        0,
        timeLeft - amount
      );

    updateUI();

    if (timeLeft <= 0) {

      endGame(
        "⏰ TIME RAN OUT!"
      );

    }

  }


  /* =========================================================
     UI
  ========================================================= */

  function updateUI() {

    if (scoreEl) {

      scoreEl.textContent =
        score;

    }

    if (comboEl) {

      comboEl.textContent =
        combo;

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
        Math.ceil(
          Math.max(0, timeLeft)
        );

    }

    if (bestScoreEl) {

      bestScoreEl.textContent =
        bestScore;

    }

    if (roundEl) {

      roundEl.textContent =
        round;

    }

    if (
      targetAnimalEl &&
      targetAnimal
    ) {

      targetAnimalEl.textContent =
        `${targetAnimal.emoji} ${targetAnimal.name}`;

    }

    if (targetProgressEl) {

      targetProgressEl.textContent =
        `${hitsThisRound} / ${HITS_REQUIRED} HITS`;

    }

    if (
      specialAnimalEl &&
      specialAnimal
    ) {

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

      const frequencies = {

        hit: 520,

        combo: 720,

        special: 900,

        wrong: 230,

        bomb: 80,

        round: 1050,

        scare: 160,

        gameover: 110

      };

      oscillator.type = "sine";

      oscillator.frequency.value =
        frequencies[type] || 500;

      oscillator.connect(gain);

      gain.connect(
        context.destination
      );

      gain.gain.setValueAtTime(
        .08,
        context.currentTime
      );

      gain.gain.exponentialRampToValueAtTime(
        .001,
        context.currentTime + .18
      );

      oscillator.start();

      oscillator.stop(
        context.currentTime + .18
      );

    } catch (error) {}

  }


  /* =========================================================
     CHOOSE ROUND TARGET
  ========================================================= */

  function chooseRoundAnimals() {

    targetAnimal =
      randomItem(
        ANIMALS
      );

    specialAnimal =
      randomItem(
        SPECIAL_ANIMALS
      );

    hitsThisRound = 0;

    updateUI();

  }


  /* =========================================================
     CLEAR BOARD
  ========================================================= */

  function clearBoard() {

    clearTimeout(
      hideTimeout
    );

    activeObjects.clear();

    holes.forEach(
      (hole, index) => {

        hole.classList.remove(
          "active",
          "special",
          "bomb",
          "target-hit",
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

      }
    );

  }


  /* =========================================================
     GET AVAILABLE POSITIONS
  ========================================================= */

  function getPositions(count) {

    const positions =
      shuffle(
        [...Array(holes.length).keys()]
      );

    return positions.slice(
      0,
      Math.min(
        count,
        holes.length
      )
    );

  }


  /* =========================================================
     CREATE WAVE
  ========================================================= */

  function spawnWave() {

    if (!gameRunning) return;

    clearBoard();

    const config =
      settings();


    /* =====================================================
       OBJECT COUNT
    ===================================================== */

    const roundBonus =
      Math.min(
        2,
        Math.floor(
          (round - 1) / 3
        )
      );

    const objectCount =
      Math.min(
        7,
        randomInt(
          config.minObjects,
          Math.min(
            config.maxObjects,
            4 + roundBonus
          )
        )
      );


    const positions =
      getPositions(
        objectCount
      );


    /* =====================================================
       GUARANTEED TARGET
       ================================================ */

    /*
       The target must appear frequently.

       We don't rely on pure randomness.
       Every wave has a strong chance of target.
       */

    const targetCount =
      Math.random() <
      .35
        ? 2
        : 1;


    const targetPositions =
      shuffle(
        positions
      ).slice(
        0,
        Math.min(
          targetCount,
          positions.length
        )
      );


    /* =====================================================
       CREATE OBJECTS
    ===================================================== */

    positions.forEach(
      (position, index) => {

        const hole =
          holes[position];

        const animal =
          animals[position];

        if (!hole || !animal)
          return;


        let type = "wrong";

        let chosenAnimal = null;


        /* -----------------------------------------------
           TARGET
        ------------------------------------------------ */

        if (
          targetPositions.includes(
            position
          )
        ) {

          type = "target";

          chosenAnimal =
            targetAnimal;

        }


        /* -----------------------------------------------
           BOMB
        ------------------------------------------------ */

        else if (
          Math.random() <
          config.bombChance
        ) {

          type = "bomb";

        }


        /* -----------------------------------------------
           SPECIAL
        ------------------------------------------------ */

        else if (
          Math.random() <
          config.specialChance
        ) {

          type = "special";

        }


        /* -----------------------------------------------
           WRONG ANIMAL
        ------------------------------------------------ */

        else {

          const wrongAnimals =
            ANIMALS.filter(
              animalItem =>
                animalItem.name !==
                targetAnimal.name
            );

          chosenAnimal =
            randomItem(
              wrongAnimals
            );

          type = "wrong";

        }


        /* -----------------------------------------------
           DISPLAY
        ------------------------------------------------ */

        if (type === "bomb") {

          animal.textContent =
            "💣";

        }

        else if (type === "special") {

          animal.textContent =
            specialAnimal.emoji;

        }

        else {

          animal.textContent =
            chosenAnimal.emoji;

        }


        animal.dataset.type =
          type;

        hole.classList.add(
          "active"
        );


        if (type === "bomb") {

          hole.classList.add(
            "bomb"
          );

        }

        if (type === "special") {

          hole.classList.add(
            "special"
          );

        }


        activeObjects.set(
          position,
          {

            type,

            animal:
              chosenAnimal,

            points:
              type === "special"
                ? specialAnimal.points
                : chosenAnimal
                  ? chosenAnimal.points
                  : 0

          }
        );

      }
    );


    /* =====================================================
       WAVE AUTO-HIDE
    ===================================================== */

    hideTimeout =
      setTimeout(
        () => {

          if (!gameRunning)
            return;


          /*
             If targets were missed,
             punish the player slightly.
          */

          let missedTargets = 0;

          activeObjects.forEach(
            object => {

              if (
                object.type ===
                "target"
              ) {

                missedTargets++;

              }

            }
          );


          if (missedTargets > 0) {

            combo = 0;

            removeTime(
              .7 *
              missedTargets
            );

            message(
              "😱 Target escaped! Find it faster!"
            );

            playSound(
              "wrong"
            );

          }


          clearBoard();

          scheduleNextWave();

        },
        getWaveTime()
      );


    /* =====================================================
       RANDOM SCARE
    ===================================================== */

    maybeScheduleScare();

  }


  /* =========================================================
     WAVE SPEED
  ========================================================= */

  function getWaveTime() {

    const config =
      settings();

    const reduction =
      Math.min(
        420,
        (round - 1) * 35
      );

    return Math.max(
      450,
      config.waveTime - reduction
    );

  }


  function scheduleNextWave() {

    if (!gameRunning)
      return;

    clearTimeout(
      waveTimeout
    );

    waveTimeout =
      setTimeout(
        () => {

          spawnWave();

        },
        settings().nextDelay
      );

  }


  /* =========================================================
     HAMMER
  ========================================================= */

  function showHammer(event) {

    if (!hammer)
      return;

    if (!gameBoard)
      return;


    const rect =
      gameBoard.getBoundingClientRect();


    let x =
      event.clientX -
      rect.left;

    let y =
      event.clientY -
      rect.top;


    /*
       Keep hammer inside board.
    */

    x =
      Math.max(
        35,
        Math.min(
          rect.width - 35,
          x
        )
      );

    y =
      Math.max(
        35,
        Math.min(
          rect.height - 35,
          y
        )
      );


    hammer.style.left =
      `${x - 35}px`;

    hammer.style.top =
      `${y - 55}px`;


    hammer.classList.remove(
      "hammer-hit"
    );


    void hammer.offsetWidth;


    hammer.classList.add(
      "hammer-hit"
    );

  }


  /* =========================================================
     HIT HOLE
  ========================================================= */

  function hitHole(index, event = null) {

    if (!gameRunning)
      return;


    if (event) {

      showHammer(
        event
      );

    }


    const object =
      activeObjects.get(
        index
      );


    const hole =
      holes[index];


    if (!hole)
      return;


    /* =====================================================
       EMPTY
    ===================================================== */

    if (!object) {

      message(
        "😅 Too early! Watch carefully!"
      );

      removeTime(
        .15
      );

      return;

    }


    /* =====================================================
       BOMB
    ===================================================== */

    if (
      object.type ===
      "bomb"
    ) {

      hole.classList.add(
        "target-hit"
      );

      playSound(
        "bomb"
      );

      message(
        "💣 BOOM! You hit the bomb!"
      );

      endGame(
        "💣 BOOM! Bomb smashed!"
      );

      return;

    }


    


    /* =====================================================
   WRONG ANIMAL
===================================================== */

if (
  object.type ===
  "wrong"
) {

  combo = 0;

  lives--;

  hole.classList.add(
    "miss"
  );

  playSound(
    "wrong"
  );

  removeTime(
    settings().wrongPenalty
  );

  updateUI();

  if (lives <= 0) {

    message(
      "💔 No lives left!"
    );

    endGame(
      "💔 GAME OVER! No lives left!"
    );

    return;

  }

  message(
    `❌ Wrong! ${lives} ❤️ left. Find ${targetAnimal.emoji} ${targetAnimal.name}!`
  );

  activeObjects.delete(
    index
  );

  hole.classList.remove(
    "active"
  );

  const animal =
    animals[index];

  if (animal) {

    animal.textContent = "";

    animal.removeAttribute(
      "data-type"
    );

  }

  return;

}


    /* =====================================================
       TARGET
    ===================================================== */

    if (
      object.type ===
      "target"
    ) {

      const comboBonus =
        Math.min(
          combo * 2,
          30
        );


      const points =
        targetAnimal.points +
        comboBonus;


      score +=
        points;


      combo++;

      hitsThisRound++;


      /*
         Correct hit = more time
      */

      const timeReward =
        settings().correctTime +
        Math.min(
          combo * .08,
          1
        );


      addTime(
        timeReward
      );


      hole.classList.add(
        "target-hit"
      );


      playSound(
        combo >= 5
          ? "combo"
          : "hit"
      );


      if (
        combo > 0 &&
        combo % 5 === 0
      ) {

        message(
          `🔥 ${combo} COMBO! +${points} • +${timeReward.toFixed(1)} SEC!`
        );

      }

      else {

        message(
          `🎯 PERFECT! +${points} • +${timeReward.toFixed(1)} SEC`
        );

      }


      updateUI();


      removeObject(
        index
      );


      /* ===================================================
         ROUND COMPLETE
      =================================================== */

      if (
        hitsThisRound >=
        HITS_REQUIRED
      ) {

        completeRound();

        return;

      }


      /*
         Immediately replace the smashed target.
         This ensures the target keeps appearing.
      */

      setTimeout(
        () => {

          if (
            gameRunning &&
            activeObjects.size <
            settings().simultaneous
          ) {

            spawnReplacement();

          }

        },
        120
      );

    }

  }


  /* =========================================================
     REMOVE OBJECT
  ========================================================= */

  function removeObject(index) {

    activeObjects.delete(
      index
    );


    const hole =
      holes[index];

    const animal =
      animals[index];


    if (hole) {

      hole.classList.remove(
        "active",
        "special",
        "bomb"
      );

    }


    if (animal) {

      animal.textContent = "";

      animal.removeAttribute(
        "data-type"
      );

    }

  }


  /* =========================================================
     SPAWN REPLACEMENT
  ========================================================= */

  function spawnReplacement() {

    if (!gameRunning)
      return;


    const empty =
      holes
        .map(
          (hole, index) =>
            activeObjects.has(index)
              ? null
              : index
        )
        .filter(
          index =>
            index !== null
        );


    if (!empty.length)
      return;


    const index =
      randomItem(
        empty
      );


    const hole =
      holes[index];

    const animal =
      animals[index];


    /*
       Target is deliberately
       very likely here.

       This prevents the old problem
       where the player needs 10 hits
       but sees only 2 frogs.
    */

    const makeTarget =
      Math.random() <
      .78;


    let type;

    let chosenAnimal;


    if (makeTarget) {

      type = "target";

      chosenAnimal =
        targetAnimal;

    }

    else if (
      Math.random() <
      settings().bombChance
    ) {

      type = "bomb";

    }

    else if (
      Math.random() <
      settings().specialChance
    ) {

      type = "special";

    }

    else {

      type = "wrong";

      chosenAnimal =
        randomItem(
          ANIMALS.filter(
            item =>
              item.name !==
              targetAnimal.name
          )
        );

    }


    if (
      type ===
      "target"
    ) {

      animal.textContent =
        targetAnimal.emoji;

    }

    else if (
      type ===
      "bomb"
    ) {

      animal.textContent =
        "💣";

    }

    else if (
      type ===
      "special"
    ) {

      animal.textContent =
        specialAnimal.emoji;

    }

    else {

      animal.textContent =
        chosenAnimal.emoji;

    }


    animal.dataset.type =
      type;


    hole.classList.add(
      "active"
    );


    if (
      type ===
      "bomb"
    ) {

      hole.classList.add(
        "bomb"
      );

    }


    if (
      type ===
      "special"
    ) {

      hole.classList.add(
        "special"
      );

    }


    activeObjects.set(
      index,
      {

        type,

        animal:
          chosenAnimal,

        points:
          type === "special"
            ? specialAnimal.points
            : chosenAnimal
              ? chosenAnimal.points
              : 0

      }
    );

  }


  /* =========================================================
     ROUND COMPLETE
  ========================================================= */

  function completeRound() {

    if (!gameRunning)
      return;


    clearBoard();


    playSound(
      "round"
    );


    const reward =
      50 +
      round * 20;


    score +=
      reward;


    addTime(
      4
    );


    message(
      `🔥 ROUND ${round} COMPLETE! +${reward} BONUS • +4 SEC!`
    );


    round++;


    combo = 0;


    chooseRoundAnimals();


    updateUI();


    setTimeout(
      () => {

        if (!gameRunning)
          return;


        message(
          `🎯 ROUND ${round}: FIND ${targetAnimal.emoji} ${targetAnimal.name}!`
        );


        spawnWave();

      },
      850
    );

  }


  /* =========================================================
     SCARE SYSTEM
  ========================================================= */

  function maybeScheduleScare() {

    clearTimeout(
      scareTimeout
    );


    if (
      !gameRunning
    )
      return;


    /*
       Scares become more likely
       as the game progresses.
    */

    const chance =
      Math.min(
        .18,
        settings().scareChance +
        round * .008
      );


    if (
      Math.random() <
      chance
    ) {

      scareTimeout =
        setTimeout(
          () => {

            triggerScare();

          },
          randomInt(
            350,
            900
          )
        );

    }

  }


  function triggerScare() {

    if (
      !gameRunning ||
      !scareOverlay
    )
      return;


    if (scareEmoji) {

      scareEmoji.textContent =
        randomItem(
          SCARE_EVENTS
        );

    }


    scareOverlay.classList.remove(
      "show"
    );


    void scareOverlay.offsetWidth;


    scareOverlay.classList.add(
      "show"
    );


    playSound(
      "scare"
    );


    message(
      "👻 DON'T GET DISTRACTED!"
    );


    setTimeout(
      () => {

        if (
          scareOverlay
        ) {

          scareOverlay.classList.remove(
            "show"
          );

        }

      },
      750
    );

  }


  /* =========================================================
     TIMER
  ========================================================= */

  function startTimer() {

    clearInterval(
      timerInterval
    );


    timerInterval =
      setInterval(
        () => {

          if (
            !gameRunning
          )
            return;


          timeLeft -=
            .1;


          updateUI();


          if (
            timeLeft <= 0
          ) {

            endGame(
              "⏰ TIME RAN OUT!"
            );

          }

        },
        100
      );

  }


  /* =========================================================
     START GAME
  ========================================================= */

  function startGame() {

    stopLoops();

    clearBoard();

    score = 0;

    combo = 0;

    lives =
      STARTING_LIVES;

    round = 1;

    timeLeft =
      START_TIME;

    gameRunning =
      true;


    chooseRoundAnimals();


    if (
      difficultyPanel
    ) {

      difficultyPanel.classList.add(
        "hidden"
      );

    }


    if (
      objectivePanel
    ) {

      objectivePanel.classList.remove(
        "hidden"
      );

    }


    if (
      startButton
    ) {

      startButton.classList.add(
        "hidden"
      );

    }


    if (
      restartButton
    ) {

      restartButton.classList.add(
        "hidden"
      );

    }


    if (
      difficultyButton
    ) {

      difficultyButton.classList.remove(
        "hidden"
      );

    }


    updateUI();


    message(
      `🎯 FIND ${targetAnimal.emoji} ${targetAnimal.name}!`
    );


    startTimer();


    setTimeout(
      () => {

        if (
          gameRunning
        ) {

          spawnWave();

        }

      },
      500
    );

  }


  /* =========================================================
     END GAME
  ========================================================= */

  function endGame(reason) {

    if (
      !gameRunning
    )
      return;


    gameRunning =
      false;


    stopLoops();

    clearBoard();


    playSound(
      "gameover"
    );


    if (
      score >
      bestScore
    ) {

      bestScore =
        score;


      localStorage.setItem(
        "animalSmashBestScore",
        bestScore
      );


      message(
        `🏆 NEW BEST SCORE! ${score} POINTS!`
      );

    }

    else {

      message(
        `${reason} SCORE: ${score} • ROUND: ${round}`
      );

    }


    if (
      restartButton
    ) {

      restartButton.classList.remove(
        "hidden"
      );

    }


    if (
      startButton
    ) {

      startButton.classList.remove(
        "hidden"
      );

    }


    updateUI();

  }


  /* =========================================================
     STOP LOOPS
  ========================================================= */

  function stopLoops() {

    clearInterval(
      timerInterval
    );

    clearTimeout(
      waveTimeout
    );

    clearTimeout(
      hideTimeout
    );

    clearTimeout(
      scareTimeout
    );


    timerInterval = null;

    waveTimeout = null;

    hideTimeout = null;

    scareTimeout = null;

  }


  /* =========================================================
     DIFFICULTY
  ========================================================= */

  document
    .querySelectorAll(
      "[data-difficulty]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            const selected =
              button.dataset.difficulty;


            if (
              !DIFFICULTY[selected]
            )
              return;


            difficulty =
              selected;


            document
              .querySelectorAll(
                "[data-difficulty]"
              )
              .forEach(
                buttonItem => {

                  buttonItem.classList.remove(
                    "active"
                  );

                }
              );


            button.classList.add(
              "active"
            );


            message(
              `🎮 ${selected.toUpperCase()} selected! Press START GAME.`
            );

          }
        );

      }
    );


  /* =========================================================
     START
  ========================================================= */

  if (
    startButton
  ) {

    startButton.addEventListener(
      "click",
      startGame
    );

  }


  /* =========================================================
     RESTART
  ========================================================= */

  if (
    restartButton
  ) {

    restartButton.addEventListener(
      "click",
      startGame
    );

  }


  /* =========================================================
     CHANGE DIFFICULTY
  ========================================================= */

  if (
    difficultyButton
  ) {

    difficultyButton.addEventListener(
      "click",
      () => {

        stopLoops();

        gameRunning =
          false;

        clearBoard();


        if (
          objectivePanel
        ) {

          objectivePanel.classList.add(
            "hidden"
          );

        }


        if (
          difficultyPanel
        ) {

          difficultyPanel.classList.remove(
            "hidden"
          );

        }


        if (
          startButton
        ) {

          startButton.classList.remove(
            "hidden"
          );

        }


        if (
          restartButton
        ) {

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

  if (
    soundButton
  ) {

    soundButton.addEventListener(
      "click",
      () => {

        soundEnabled =
          !soundEnabled;


        soundButton.textContent =
          soundEnabled
            ? "🔊"
            : "🔇";


        if (
          soundEnabled
        ) {

          playSound(
            "hit"
          );

        }

      }
    );

  }


  /* =========================================================
     BACK
  ========================================================= */

  if (
    backButton
  ) {

    backButton.addEventListener(
      "click",
      () => {

        window.location.href =
          "index.html";

      }
    );

  }


  /* =========================================================
     HOLE CLICK / TOUCH
  ========================================================= */

  holes.forEach(
    (hole, index) => {

      hole.addEventListener(
        "pointerdown",
        event => {

          event.preventDefault();

          if (
            !gameRunning
          )
            return;


          hitHole(
            index,
            event
          );

        }
      );

    }
  );


  /* =========================================================
     KEYBOARD
  ========================================================= */

  document.addEventListener(
    "keydown",
    event => {

      if (
        !gameRunning
      )
        return;


      const number =
        Number(
          event.key
        );


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
     INITIAL UI
  ========================================================= */

  if (
    bestScoreEl
  ) {

    bestScoreEl.textContent =
      bestScore;

  }


  updateUI();


  message(
    "Choose a difficulty to begin! 🎯"
  );


  console.log(
    "🐾 Animal Smash Advanced System Loaded!"
  );

})();
