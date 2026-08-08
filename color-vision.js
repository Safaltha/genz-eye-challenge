/* =========================================
   🎨 COLOR VISION CHALLENGE
========================================= */

// =========================================
// TEST DATA
// =========================================

const tests = [
    {
        image: "color-images/IMG_20260808_133134.jpg",
        answer: "74"
    },
    {
        image: "color-images/IMG_20260808_133151.jpg",
        answer: "12"
    },
    {
        image: "color-images/IMG_20260808_133208.jpg",
        answer: "6"
    },
    {
        image: "color-images/IMG_20260808_133321.jpg",
        answer: "3"
    },
    {
        image: "color-images/IMG_20260808_133456.jpg",
        answer: "96"
    },
    {
        image: "color-images/IMG_20260808_133511.jpg",
        answer: "2"
    },
    {
        image: "color-images/IMG_20260808_133611.jpg",
        answer: "5"
    },
    {
        image: "color-images/IMG_20260808_133652.jpg",
        answer: "42"
    },
    {
        image: "color-images/IMG_20260808_133753.jpg",
        answer: "8"
    },
    {
        image: "color-images/IMG_20260808_133824.jpg",
        answer: "6"
    },
    {
        image: "color-images/IMG_20260808_133839.jpg",
        answer: "3"
    }
];


// =========================================
// GAME VARIABLES
// =========================================

let currentTest = 0;

let score = 0;

let streak = 0;

let bestStreak = 0;

let lives = 3;

let correctAnswers = 0;

let wrongAnswers = 0;

let timeLeft = 20;

let timerInterval = null;

let questionAnswered = false;


// =========================================
// HTML ELEMENTS
// =========================================

const startScreen =
    document.getElementById("start-screen");

const gameScreen =
    document.getElementById("game-screen");

const resultScreen =
    document.getElementById("result-screen");

const startButton =
    document.getElementById("start-button");

const restartButton =
    document.getElementById("restart-button");

const testImage =
    document.getElementById("test-image");

const answerButtons =
    document.getElementById("answer-buttons");

const feedback =
    document.getElementById("feedback");

const scoreDisplay =
    document.getElementById("score");

const streakDisplay =
    document.getElementById("streak");

const livesDisplay =
    document.getElementById("lives");

const timerDisplay =
    document.getElementById("timer");

const currentTestDisplay =
    document.getElementById("current-test");

const progressFill =
    document.getElementById("progress-fill");

const finalScore =
    document.getElementById("final-score");

const correctCount =
    document.getElementById("correct-count");

const wrongCount =
    document.getElementById("wrong-count");

const bestStreakDisplay =
    document.getElementById("best-streak");

const resultMessage =
    document.getElementById("result-message");


// =========================================
// START GAME
// =========================================

startButton.addEventListener("click", startGame);

restartButton.addEventListener("click", startGame);


function startGame() {

    currentTest = 0;

    score = 0;

    streak = 0;

    bestStreak = 0;

    lives = 3;

    correctAnswers = 0;

    wrongAnswers = 0;

    clearInterval(timerInterval);

    updateDisplays();

    startScreen.classList.add("hidden");

    resultScreen.classList.add("hidden");

    gameScreen.classList.remove("hidden");

    loadTest();

}


// =========================================
// LOAD TEST
// =========================================

function loadTest() {

    if (currentTest >= tests.length) {

        finishGame();

        return;

    }

    questionAnswered = false;

    feedback.textContent = "";

    feedback.className = "feedback";

    const test = tests[currentTest];

    testImage.src = test.image;

    testImage.alt =
        `Color vision test ${currentTest + 1}`;

    currentTestDisplay.textContent =
        currentTest + 1;

    updateProgress();

    createAnswerButtons(test.answer);

    startTimer();

}


// =========================================
// CREATE ANSWER BUTTONS
// =========================================

function createAnswerButtons(correctAnswer) {

    answerButtons.innerHTML = "";

    /*
       Create believable wrong answers
       automatically.
    */

    const answers =
        generateAnswers(correctAnswer);

    answers.forEach(answer => {

        const button =
            document.createElement("button");

        button.className =
            "answer-button";

        button.textContent =
            answer;

        button.addEventListener(
            "click",
            () => checkAnswer(
                answer,
                correctAnswer,
                button
            )
        );

        answerButtons.appendChild(button);

    });

}


// =========================================
// GENERATE ANSWER OPTIONS
// =========================================

function generateAnswers(correctAnswer) {

    const answers = [correctAnswer];

    const possibleNumbers = [
        "2",
        "3",
        "5",
        "6",
        "8",
        "12",
        "15",
        "21",
        "25",
        "29",
        "42",
        "45",
        "56",
        "69",
        "74",
        "82",
        "96"
    ];

    while (answers.length < 4) {

        const random =
            possibleNumbers[
                Math.floor(
                    Math.random() *
                    possibleNumbers.length
                )
            ];

        if (!answers.includes(random)) {

            answers.push(random);

        }

    }

    // Shuffle answers

    for (
        let i = answers.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(Math.random() * (i + 1));

        [
            answers[i],
            answers[j]
        ] = [
            answers[j],
            answers[i]
        ];

    }

    return answers;

}


// =========================================
// CHECK ANSWER
// =========================================

function checkAnswer(
    selectedAnswer,
    correctAnswer,
    selectedButton
) {

    if (questionAnswered) {
        return;
    }

    questionAnswered = true;

    clearInterval(timerInterval);

    const buttons =
        document.querySelectorAll(
            ".answer-button"
        );

    buttons.forEach(button => {

        button.disabled = true;

        if (
            button.textContent ===
            correctAnswer
        ) {

            button.classList.add("correct");

        }

    });


    // =====================================
    // CORRECT
    // =====================================

    if (selectedAnswer === correctAnswer) {

        selectedButton.classList.add("correct");

        correctAnswers++;

        streak++;

        if (streak > bestStreak) {

            bestStreak = streak;

        }

        const points =
            10 + (streak - 1) * 5;

        score += points;

        feedback.textContent =
            `✅ Correct! +${points} points`;

        feedback.style.color =
            "#22c55e";

    }

    // =====================================
    // WRONG
    // =====================================

    else {

        selectedButton.classList.add("wrong");

        wrongAnswers++;

        streak = 0;

        lives--;

        feedback.textContent =
            `❌ Wrong! The answer was ${correctAnswer}`;

        feedback.style.color =
            "#ef4444";

    }


    updateDisplays();


    // Continue automatically

    setTimeout(() => {

        if (lives <= 0) {

            finishGame();

            return;

        }

        currentTest++;

        loadTest();

    }, 1400);

}


// =========================================
// TIMER
// =========================================

function startTimer() {

    clearInterval(timerInterval);

    timeLeft = 20;

    timerDisplay.textContent =
        timeLeft;

    timerInterval =
        setInterval(() => {

            timeLeft--;

            timerDisplay.textContent =
                timeLeft;

            if (timeLeft <= 0) {

                clearInterval(timerInterval);

                timeUp();

            }

        }, 1000);

}


// =========================================
// TIME UP
// =========================================

function timeUp() {

    if (questionAnswered) {
        return;
    }

    questionAnswered = true;

    wrongAnswers++;

    streak = 0;

    lives--;

    const correctAnswer =
        tests[currentTest].answer;

    const buttons =
        document.querySelectorAll(
            ".answer-button"
        );

    buttons.forEach(button => {

        button.disabled = true;

        if (
            button.textContent ===
            correctAnswer
        ) {

            button.classList.add("correct");

        }

    });

    feedback.textContent =
        `⏰ Time's up! Answer: ${correctAnswer}`;

    feedback.style.color =
        "#f59e0b";

    updateDisplays();

    setTimeout(() => {

        if (lives <= 0) {

            finishGame();

            return;

        }

        currentTest++;

        loadTest();

    }, 1400);

}


// =========================================
// UPDATE DISPLAYS
// =========================================

function updateDisplays() {

    scoreDisplay.textContent =
        score;

    streakDisplay.textContent =
        streak;

    livesDisplay.textContent =
        lives;

}


// =========================================
// UPDATE PROGRESS
// =========================================

function updateProgress() {

    const progress =
        (currentTest / tests.length) * 100;

    progressFill.style.width =
        `${progress}%`;

}


// =========================================
// FINISH GAME
// =========================================

function finishGame() {

    clearInterval(timerInterval);

    gameScreen.classList.add("hidden");

    resultScreen.classList.remove("hidden");

    finalScore.textContent =
        score;

    correctCount.textContent =
        correctAnswers;

    wrongCount.textContent =
        wrongAnswers;

    bestStreakDisplay.textContent =
        bestStreak;

    progressFill.style.width =
        "100%";


    // Result message

    const percentage =
        Math.round(
            (correctAnswers / tests.length) *
            100
        );


    if (percentage >= 90) {

        resultMessage.textContent =
            "🔥 Amazing! Your color vision challenge score is excellent!";

    }

    else if (percentage >= 70) {

        resultMessage.textContent =
            "👏 Great job! You spotted most of the hidden numbers.";

    }

    else if (percentage >= 50) {

        resultMessage.textContent =
            "👍 Nice try! Can you beat your score next time?";

    }

    else {

        resultMessage.textContent =
            "👀 Interesting result! Try again and see if you can improve.";

    }

}


// =========================================
// PREVENT IMAGE DRAGGING
// =========================================

testImage.addEventListener(
    "dragstart",
    event => event.preventDefault()
);
