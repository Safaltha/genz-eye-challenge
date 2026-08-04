
// ===== GenZ Text Quiz Engine (Part 1) =====

let currentDifficulty = "easy";
let questions = [];
let currentQuestion = 0;
let score = 0;
let timer = 30;
let timerInterval = null;

const difficultyScreen = document.getElementById("difficulty-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const questionText = document.getElementById("question");
const answersDiv = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");

const scoreText = document.getElementById("score");
const timerText = document.getElementById("timer");
const questionNumber = document.getElementById("question-number");
const progressBar = document.getElementById("progress-bar");
const finalScore = document.getElementById("final-score");

function startQuiz(level){

currentDifficulty = level;

if(level==="easy"){
questions=[...easyQuestions];
}

if(level==="medium"){
questions=[...mediumQuestions];
}

if(level==="hard"){
questions=[...hardQuestions];
}

shuffleQuestions();

difficultyScreen.style.display="none";
quizScreen.style.display="block";

currentQuestion=0;
score=0;

showQuestion();

}

function shuffleQuestions(){

for(let i=questions.length-1;i>0;i--){

const j=Math.floor(Math.random()*(i+1));

[questions[i],questions[j]]=[questions[j],questions[i]];

}

}

function showQuestion(){

clearInterval(timerInterval);

timer=30;

timerText.innerText=timer+"s";

timerInterval=setInterval(function(){

timer--;

timerText.innerText=timer+"s";

if(timer<=0){

clearInterval(timerInterval);

nextQuestion();

}

},1000);

updateProgress();

const q=questions[currentQuestion];

questionText.innerText=q.question;

answersDiv.innerHTML="";

questionNumber.innerText=`Question ${currentQuestion+1}/${questions.length}`;

scoreText.innerText=`Score: ${score}`;

q.options.forEach(function(option,index){

const btn=document.createElement("button");

btn.innerText=option;

btn.onclick=function(){

checkAnswer(index);

};

answersDiv.appendChild(btn);

});

}

// ===== GenZ Text Quiz Engine (Part 2) =====

function checkAnswer(selectedIndex){

clearInterval(timerInterval);

const q=questions[currentQuestion];

const buttons=answersDiv.querySelectorAll("button");

buttons.forEach(function(btn,index){

btn.disabled=true;

if(index===q.answer){

btn.classList.add("correct");

}

if(index===selectedIndex && index!==q.answer){

btn.classList.add("wrong");

}

});

if(selectedIndex===q.answer){

score++;

scoreText.innerText=`Score: ${score}`;

}

}

nextBtn.onclick=function(){

nextQuestion();

};

function nextQuestion(){

clearInterval(timerInterval);

currentQuestion++;

if(currentQuestion>=questions.length){

showResult();

return;

}

showQuestion();

}

function updateProgress(){

const percent=((currentQuestion)/questions.length)*100;

progressBar.style.width=percent+"%";

}

function showResult(){

quizScreen.style.display="none";

resultScreen.style.display="block";

finalScore.innerHTML=`
<h2>Your Score</h2>
<h1>${score} / ${questions.length}</h1>
<p>🎉 Great Job!</p>
`;

}
