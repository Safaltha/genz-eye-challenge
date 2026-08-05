const board = document.getElementById("gameBoard");
const scoreText = document.getElementById("score");
const levelText = document.getElementById("level");
const timeText = document.getElementById("time");
const nextBtn = document.getElementById("nextBtn");

let score = 0;
let level = 1;
let time = 20;
let timer;
let found = false;

function randomColor() {
    const r = Math.floor(Math.random() * 120) + 80;
    const g = Math.floor(Math.random() * 120) + 80;
    const b = Math.floor(Math.random() * 120) + 80;
    return { r, g, b };
}

function createBoard() {

    board.innerHTML = "";
    found = false;

    const total = 25;
    const odd = Math.floor(Math.random() * total);

    const base = randomColor();

    let diff = Math.max(5, 30 - level);

    for (let i = 0; i < total; i++) {

        const square = document.createElement("div");
        square.className = "square";

        if (i === odd) {

            square.style.backgroundColor =
                `rgb(${base.r + diff},${base.g + diff},${base.b + diff})`;

            square.onclick = function () {

                if (found) return;

                found = true;

                score += 10;
                level++;

                scoreText.innerText = score;
                levelText.innerText = level;

                alert("🎉 Correct! Get ready for the next level.");

            };

        } else {

            square.style.backgroundColor =
                `rgb(${base.r},${base.g},${base.b})`;

        }

        board.appendChild(square);

    }

}

function startTimer() {

    clearInterval(timer);

    time = 20;

    timeText.innerText = time;

    timer = setInterval(function () {

        time--;

        timeText.innerText = time;

        if (time <= 0) {

            clearInterval(timer);

            alert("⏰ Time's Up!\nFinal Score: " + score);

            location.reload();

        }

    }, 1000);

}

nextBtn.onclick = function () {

    createBoard();

    startTimer();

};

createBoard();
startTimer();
