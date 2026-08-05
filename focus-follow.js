const orb = document.getElementById("orb");

const gameBox = document.getElementById("gameBox");


let score = 0;
let combo = 0;
let level = 1;
let time = 30;

let gameRunning = false;

let timer;
let moveTimer;



function startGame(){

score = 0;
combo = 0;
level = 1;
time = 30;

updateStats();

gameRunning = true;

orb.style.display="block";

document.getElementById("message").innerHTML =
"👁️ Follow the orb and tap quickly!";


moveOrb();


clearInterval(timer);


timer=setInterval(()=>{


time--;

document.getElementById("time").innerHTML=time;



if(time<=0){

endGame();

}


},1000);



clearInterval(moveTimer);


moveTimer=setInterval(()=>{


if(gameRunning){

moveOrb();

}


},1200);



}





function moveOrb(){


let maxX = gameBox.clientWidth - orb.offsetWidth;

let maxY = gameBox.clientHeight - orb.offsetHeight;



let x = Math.random()*maxX;

let y = Math.random()*maxY;



orb.style.left=x+"px";

orb.style.top=y+"px";



}






orb.onclick=function(){


if(!gameRunning)
return;



score += 10;

combo++;



if(combo % 5 === 0){

level++;

}


updateStats();



document.getElementById("message").innerHTML =
"🔥 Great focus! Keep following 👁️";



moveOrb();



};







function updateStats(){


document.getElementById("score").innerHTML=score;

document.getElementById("combo").innerHTML=combo;

document.getElementById("level").innerHTML=level;

document.getElementById("time").innerHTML=time;


}






function endGame(){


gameRunning=false;


clearInterval(timer);

clearInterval(moveTimer);


orb.style.display="none";


document.getElementById("message").innerHTML=

"🎉 Training Complete! Your Focus Score: "+score;



if(score>Number(localStorage.getItem("focusHighScore")||0)){


localStorage.setItem(
"focusHighScore",
score
);


document.getElementById("message").innerHTML +=
"<br>🏆 New High Score!";


}


}
