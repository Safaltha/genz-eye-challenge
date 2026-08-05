const boxes = document.getElementById("boxes");
const scoreText = document.getElementById("score");
const roundText = document.getElementById("round");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restart");

let score = 0;
let round = 1;

function createRound() {

    boxes.innerHTML = "";
    message.innerHTML = "";

    let rewards = [-10, -5, 5, 10, 10, 20, 20, 30, 50];

    rewards.sort(() => Math.random() - 0.5);

    for (let i = 0; i < 9; i++) {

        let box = document.createElement("div");
        box.className = "box";
        box.innerHTML = "🎁";

        box.onclick = function () {

            let value = rewards[i];

            score += value;

            scoreText.innerHTML = "Score: " + score;

            if (value > 0) {
                box.innerHTML = "+" + value;
                message.innerHTML = "🎉 You won " + value + " points!";
            } else {
                box.innerHTML = value;
                message.innerHTML = "😢 You lost " + Math.abs(value) + " points!";
            }

            document.querySelectorAll(".box").forEach(b => b.onclick = null);

            setTimeout(() => {

                round++;

                if (round <= 10) {

                    roundText.innerHTML = "Round: " + round + " / 10";
                    createRound();

                } else {

                    boxes.innerHTML = "";
                    roundText.innerHTML = "Game Finished";
                    message.innerHTML = "🏆 Final Score: " + score;
                    restartBtn.style.display = "inline-block";

                }

            }, 1000);

        };

        boxes.appendChild(box);
    }
}

restartBtn.onclick = function () {

    score = 0;
    round = 1;

    scoreText.innerHTML = "Score: 0";
    roundText.innerHTML = "Round: 1 / 10";

    restartBtn.style.display = "none";

    createRound();

};

createRound();
