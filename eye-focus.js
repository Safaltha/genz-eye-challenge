const grid = document.getElementById("grid");
const levelText = document.getElementById("level");
const scoreText = document.getElementById("score");
const message = document.getElementById("message");
const startBtn = document.getElementById("startBtn");

let level = 1;
let score = 0;

const letterPairs = [
    ["O","Q"],
    ["C","G"],
    ["M","N"],
    ["E","F"],
    ["P","R"],
    ["X","K"]
];

startBtn.onclick = function () {

    level = 1;
    score = 0;

    startBtn.style.display = "none";

    createLevel();

};

function createLevel(){

    grid.innerHTML = "";
    message.innerHTML = "";

    levelText.innerHTML = "Level: " + level;
    scoreText.innerHTML = "Score: " + score;

    let pair = letterPairs[Math.min(level-1, letterPairs.length-1)];

    let normal = pair[0];
    let odd = pair[1];

    let size = Math.min(8 + level - 1, 12);

    grid.style.gridTemplateColumns = `repeat(${size},1fr)`;

    let total = size * size;

    let oddIndex = Math.floor(Math.random() * total);

    for(let i=0;i<total;i++){

        let cell = document.createElement("div");
        cell.className = "cell";

        if(i === oddIndex){

            cell.innerHTML = odd;

            cell.onclick = function(){

                score += 10;
                level++;

                message.innerHTML = "✅ Correct! Next Level...";

                setTimeout(createLevel,700);

            };

        }else{

            cell.innerHTML = normal;

            cell.onclick = function(){

                message.innerHTML = "❌ Wrong! Keep looking.";

            };

        }

        grid.appendChild(cell);

    }

}
