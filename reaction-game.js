
let startTime;
let waiting = false;
let canClick = false;
let timeoutId = null;

const box = document.getElementById("reactionBox");
const result = document.getElementById("result");

const bestTimeElement = document.getElementById("bestTime");
const attemptsElement = document.getElementById("attempts");
const lastResultElement = document.getElementById("lastResult");

let attempts = Number(localStorage.getItem("reactionAttempts")) || 0;
let bestTime = Number(localStorage.getItem("reactionBest")) || 0;

updateStats();

function startReaction() {

    // Prevent starting another test while already waiting
    if (waiting) {
        return;
    }

    clearTimeout(timeoutId);

    box.innerHTML = "Wait... ⏳";
    box.style.background = "#ff4757";

    result.innerHTML = "";

    waiting = true;
    canClick = false;

    const randomTime =
        Math.floor(Math.random() * 3000) + 2000;

    timeoutId = setTimeout(() => {

        box.style.background = "#2ed573";
        box.innerHTML = "CLICK NOW! ⚡";

        startTime = Date.now();

        canClick = true;

    }, randomTime);
}


box.onclick = function () {

    // User clicked too early
    if (!canClick) {

        if (waiting) {

            clearTimeout(timeoutId);

            result.innerHTML =
                "⚠️ Too early! Wait for the signal and try again.";

            box.innerHTML = "Click Start Test";
            box.style.background = "#333";

            waiting = false;
            canClick = false;
        }

        return;
    }


    // Calculate reaction time
    const reactionTime = Date.now() - startTime;

    attempts++;

    localStorage.setItem(
        "reactionAttempts",
        attempts
    );


    // Save last result
    localStorage.setItem(
        "reactionLast",
        reactionTime
    );


    // Check personal best
    if (bestTime === 0 || reactionTime < bestTime) {

        bestTime = reactionTime;

        localStorage.setItem(
            "reactionBest",
            bestTime
        );

        result.innerHTML =
            "🎉 New personal best! ⚡ " +
            reactionTime +
            " ms";

    } else {

        result.innerHTML =
            "⚡ Your reaction time: " +
            reactionTime +
            " ms";
    }


    // Update game screen
    box.innerHTML = "Click Start Again";
    box.style.background = "#333";

    waiting = false;
    canClick = false;

    updateStats();
};


function updateStats() {

    if (attemptsElement) {
        attemptsElement.innerHTML = attempts;
    }

    if (bestTimeElement) {

        bestTimeElement.innerHTML =
            bestTime > 0
                ? bestTime + " ms"
                : "-- ms";
    }

    if (lastResultElement) {

        const lastResult =
            Number(localStorage.getItem("reactionLast")) || 0;

        lastResultElement.innerHTML =
            lastResult > 0
                ? lastResult + " ms"
                : "-- ms";
    }
}
