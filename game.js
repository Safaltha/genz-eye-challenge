
let score = Number(localStorage.getItem("score")) || 0;
let streak = Number(localStorage.getItem("streak")) || 0;
let level = Number(localStorage.getItem("level")) || 1;


const scoreBox = document.getElementById("score");
const streakBox = document.getElementById("streak");
const levelBox = document.getElementById("level");

const gameArea = document.getElementById("gameArea");



function updateStats(){

scoreBox.innerText = score;
streakBox.innerText = streak;
levelBox.innerText = level;


localStorage.setItem("score",score);
localStorage.setItem("streak",streak);
localStorage.setItem("level",level);

}



updateStats();





document.querySelectorAll(".gameBtn").forEach(button=>{


button.addEventListener("click",()=>{


let game = button.dataset.game;


if(game==="reaction"){

reactionGame();

}


else if(game==="memory"){

memoryGame();

}


else if(game==="color"){

colorGame();

}


else if(game==="number"){

numberGame();

}


else if(game==="iq"){

iqGame();

}


});


});






function addScore(points){

score += points;

streak++;

if(score>=level*100){

level++;

}


updateStats();

}







function reactionGame(){

gameArea.innerHTML=`

<h2>⚡ Reaction Master</h2>

<p>Click the button as fast as possible!</p>

<button id="reactBtn">
WAIT...
</button>

`;


let btn=document.getElementById("reactBtn");


let start=Math.random()*3000+1000;


setTimeout(()=>{


btn.innerText="CLICK NOW!";

btn.onclick=()=>{


addScore(20);

gameArea.innerHTML="🔥 Great reaction! +20 points";


};


},start);


}







function memoryGame(){


let number=Math.floor(Math.random()*9)+1;


gameArea.innerHTML=`

<h2>🧠 Memory Challenge</h2>

<p>Remember this number:</p>

<h1>${number}</h1>

<p id="hide">Remember...</p>

<input id="memoryInput">

<button id="memoryBtn">
Check
</button>

`;


setTimeout(()=>{

document.querySelector("#hide").innerText="";

},2000);



document.getElementById("memoryBtn").onclick=()=>{


if(document.getElementById("memoryInput").value==number){

addScore(30);

gameArea.innerHTML="🧠 Correct! +30";

}

else{

gameArea.innerHTML="❌ Try again";

}


};


}







function colorGame(){


let colors=["red","blue","green","yellow"];

let answer=colors[Math.floor(Math.random()*colors.length)];


gameArea.innerHTML=`

<h2>🎨 Color Vision</h2>

<p>Find the color:</p>

<h1>${answer}</h1>

<input id="colorInput">

<button id="colorBtn">
Check
</button>

`;



document.getElementById("colorBtn").onclick=()=>{


if(document.getElementById("colorInput").value.toLowerCase()==answer){

addScore(25);

gameArea.innerHTML="🎨 Correct +25";


}

else{

gameArea.innerHTML="❌ Wrong";

}


};


}







function numberGame(){


let secret=Math.floor(Math.random()*10)+1;


gameArea.innerHTML=`

<h2>🔢 Hidden Number</h2>

<p>Guess 1-10</p>

<input id="numInput">

<button id="numBtn">
Guess
</button>

`;



document.getElementById("numBtn").onclick=()=>{


if(Number(document.getElementById("numInput").value)==secret){

addScore(40);

gameArea.innerHTML="🏆 Correct +40";


}

else{

gameArea.innerHTML="❌ Wrong number";

}


};


}







function iqGame(){


gameArea.innerHTML=`

<h2>👁️ Eye IQ Test</h2>

<p>Which number is bigger?</p>

<button onclick="iqAnswer(1)">25</button>

<button onclick="iqAnswer(2)">50</button>

`;

}



function iqAnswer(answer){


if(answer===2){

addScore(35);

gameArea.innerHTML="👁️ IQ Passed +35";


}

else{

gameArea.innerHTML="Try again";

}


}







document.getElementById("resetBtn").onclick=()=>{


score=0;

streak=0;

level=1;


updateStats();


alert("Progress Reset");


};









