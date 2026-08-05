const dot = document.getElementById("dot");
const gameArea = document.getElementById("gameArea");
const scoreText = document.getElementById("score");
const timerText = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const result = document.getElementById("result");

let score = 0;
let timeLeft = 30;
let gameRunning = false;
let moveInterval;
let timerInterval;

function moveDot() {

    const maxX = gameArea.clientWidth - 50;
    const maxY = gameArea.clientHeight - 50;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    dot.style.left = x + "px";
    dot.style.top = y + "px";
}

dot.onclick = function () {

    if (!gameRunning) return;

    score++;
    scoreText.innerHTML = "Score: " + score;

    moveDot();

    // Make the game faster every 5 points
    if (score % 5 === 0) {
        clearInterval(moveInterval);

        let speed = Math.max(300, 900 - score * 20);

        moveInterval = setInterval(moveDot, speed);
    }
};

startBtn.onclick = function () {

    if (gameRunning) return;

    gameRunning = true;

    score = 0;
    timeLeft = 30;

    scoreText.innerHTML = "Score: 0";
    timerText.innerHTML = "Time: 30";
    result.innerHTML = "";

    dot.style.display = "block";

    moveDot();

    moveInterval = setInterval(moveDot, 900);

    timerInterval = setInterval(function () {

        timeLeft--;

        timerText.innerHTML = "Time: " + timeLeft;

        if (timeLeft <= 0) {

            clearInterval(timerInterval);
            clearInterval(moveInterval);

            gameRunning = false;

            dot.style.display = "none";

            result.innerHTML =
                "🎉 Game Over! Your Score: " + score;

        }

    }, 1000);

};
