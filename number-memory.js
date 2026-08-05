const levelText = document.getElementById("level");
const bestText = document.getElementById("best");
const numberDisplay = document.getElementById("numberDisplay");
const answer = document.getElementById("answer");
const checkBtn = document.getElementById("checkBtn");
const startBtn = document.getElementById("startBtn");
const message = document.getElementById("message");

let level = 1;
let best = Number(localStorage.getItem("memoryBest")) || 1;
let currentNumber = "";

bestText.innerHTML = "Best: " + best;

startBtn.onclick = function () {
    level = 1;
    startBtn.style.display = "none";
    startLevel();
};

function generateNumber(length) {
    let num = "";
    for (let i = 0; i < length; i++) {
        num += Math.floor(Math.random() * 10);
    }
    return num;
}

function startLevel() {

    levelText.innerHTML = "Level: " + level;

    currentNumber = generateNumber(level + 1);

    numberDisplay.innerHTML = currentNumber;

    answer.value = "";
    answer.style.display = "none";
    checkBtn.style.display = "none";
    message.innerHTML = "";

    setTimeout(function () {

        numberDisplay.innerHTML = "????";

        answer.style.display = "block";
        checkBtn.style.display = "inline-block";
        answer.focus();

    }, 3000);

}

checkBtn.onclick = function () {

    if (answer.value === currentNumber) {

        message.innerHTML = "✅ Correct!";

        level++;

        if (level > best) {
            best = level;
            localStorage.setItem("memoryBest", best);
            bestText.innerHTML = "Best: " + best;
        }

        setTimeout(startLevel, 1000);

    } else {

        numberDisplay.innerHTML = currentNumber;

        message.innerHTML =
            "❌ Game Over! Correct number was " + currentNumber;

        answer.style.display = "none";
        checkBtn.style.display = "none";
        startBtn.style.display = "inline-block";
        startBtn.innerHTML = "🔄 Play Again";

    }

};
