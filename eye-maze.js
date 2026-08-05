const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");


let score = 0;
let level = 1;
let time = 30;
let timer;


let player = {
x:0,
y:0,
size:20
};


let exit = {
x:300,
y:300,
size:25
};


let walls=[];



function createMaze(){

walls=[];


for(let i=0;i<8+level;i++){

walls.push({

x:Math.floor(Math.random()*15)*25,

y:Math.floor(Math.random()*15)*25,

width:25,

height:25

});

}


player.x=25;
player.y=25;


draw();

}




function draw(){


ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);


// background

ctx.fillStyle="#111";
ctx.fillRect(
0,
0,
canvas.width,
canvas.height
);


// walls

ctx.fillStyle="magenta";

walls.forEach(w=>{

ctx.fillRect(
w.x,
w.y,
w.width,
w.height
);

});


// exit

ctx.fillStyle="cyan";

ctx.fillRect(
exit.x,
exit.y,
exit.size,
exit.size
);


// player

ctx.beginPath();

ctx.fillStyle="yellow";

ctx.arc(
player.x+10,
player.y+10,
10,
0,
Math.PI*2
);

ctx.fill();


}




function movePlayer(direction){


let speed=25;

let oldX=player.x;
let oldY=player.y;


if(direction==="up")
player.y-=speed;


if(direction==="down")
player.y+=speed;


if(direction==="left")
player.x-=speed;


if(direction==="right")
player.x+=speed;



// boundary check

if(
player.x<0 ||
player.y<0 ||
player.x>325 ||
player.y>325
){

player.x=oldX;
player.y=oldY;

}



// wall collision

walls.forEach(w=>{


if(
player.x < w.x+w.width &&
player.x+20 > w.x &&
player.y < w.y+w.height &&
player.y+20 > w.y
){

player.x=oldX;
player.y=oldY;

}


});



// win check

if(
Math.abs(player.x-exit.x)<20 &&
Math.abs(player.y-exit.y)<20
){

level++;

score+=100;

document.getElementById("score").innerHTML=score;

document.getElementById("level").innerHTML=level;


document.getElementById("message").innerHTML=
"🔥 Level Complete!";


createMaze();

}


draw();

}




function startGame(){


score=0;

level=1;

time=30;


document.getElementById("score").innerHTML=score;

document.getElementById("level").innerHTML=level;

document.getElementById("time").innerHTML=time;


createMaze();



clearInterval(timer);


timer=setInterval(()=>{


time--;


document.getElementById("time").innerHTML=time;



if(time<=0){


clearInterval(timer);


document.getElementById("message").innerHTML=
"⏰ Time Over! Try Again";


}


},1000);



}




createMaze();
