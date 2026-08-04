
// GEN Z EYE CHALLENGE AI
// Main Game Controller


let score = 0;
let streak = 0;
let level = 1;

let currentQuestion = 1;
let totalQuestions = 5;

let timer = 30;
let timerInterval;



const scoreEl = document.getElementById("score");
const streakEl = document.getElementById("streak");
const levelEl = document.getElementById("level");

const questionImage =
document.getElementById("questionImage");

const answerImage =
document.getElementById("answerImage");

const answerBox =
document.getElementById("answerBox");

const questionNumber =
document.getElementById("questionNumber");

const progressBar =
document.getElementById("progressBar");

const timerEl =
document.getElementById("timer");




// START BUTTON


document.getElementById("playBtn")
.onclick = ()=>{

document
.getElementById("quiz")
.scrollIntoView();

startTimer();

};





// SHOW ANSWER


document.getElementById("answerBtn")
.onclick=()=>{

answerBox.style.display="block";

};






// NEXT QUESTION


document.getElementById("nextBtn")
.onclick=()=>{


if(currentQuestion < totalQuestions){

currentQuestion++;

loadQuestion();

}

else{


alert(
"🎉 Challenge Complete! Score: "
+score
);


saveScore();


}


};





function loadQuestion(){


questionImage.src =
"question"+currentQuestion+".jpg";


answerImage.src =
"answer"+currentQuestion+".jpg";


questionNumber.innerHTML =
currentQuestion;


answerBox.style.display="none";


progressBar.style.width =
(currentQuestion/totalQuestions*100)
+"%";


timer=30;

timerEl.innerHTML=timer;


}




// TIMER


function startTimer(){


clearInterval(timerInterval);


timerInterval=setInterval(()=>{


timer--;

timerEl.innerHTML=timer;



if(timer<=0){


clearInterval(timerInterval);


alert(
"⏰ Time Over!"
);


}


},1000);


}





// SCORE SYSTEM


function addScore(points){


score += points;

streak++;


if(streak%5===0){

level++;

}


scoreEl.innerHTML=score;

streakEl.innerHTML=streak;

levelEl.innerHTML=level;


saveScore();


}





// SAVE DATA


function saveScore(){


localStorage.setItem(
"bestScore",
score
);


document.getElementById(
"bestScore"
).innerHTML=score;


}





let oldScore =
localStorage.getItem("bestScore");


if(oldScore){

document.getElementById(
"bestScore"
).innerHTML=oldScore;

}



// DARK MODE


document.getElementById("themeBtn")
.onclick=()=>{


document.body.classList.toggle(
"light"
);


};




// SHARE


document.getElementById("shareBtn")
.onclick=()=>{


navigator.share({

title:"Gen Z Eye Challenge",

text:
"I scored "
+score+
" points! Can you beat me?"

});


};
