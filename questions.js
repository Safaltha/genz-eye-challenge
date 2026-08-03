
const puzzles = [

{
question:"images/question1.jpg",
answer:"images/answer1.jpg",
hint:"Look carefully at the small details 👀"
},

{
question:"images/question2.jpg",
answer:"images/answer2.jpg",
hint:"Try checking the corners first 🔍"
},

{
question:"images/question3.jpg",
answer:"images/answer3.jpg",
hint:"Your first guess may be wrong. Look again!"
}

];



let todayPuzzle =
puzzles[
Math.floor(Math.random()*puzzles.length)
];



const questionImage =
document.getElementById("questionImage");

const answerImage =
document.getElementById("answerImage");

const answerBox =
document.getElementById("answerBox");

const answerBtn =
document.getElementById("answerBtn");





if(questionImage){

questionImage.src =
todayPuzzle.question;

}



if(answerImage){

answerImage.src =
todayPuzzle.answer;

}







answerBtn.addEventListener(
"click",
()=>{


if(answerBox.style.display==="block"){


answerBox.style.display="none";

answerBtn.innerText =
"Reveal Answer";


}

else{


answerBox.style.display="block";

answerBtn.innerText =
"Hide Answer";


}


}
);







// Daily challenge message

let dailyMessage =
document.createElement("p");


dailyMessage.innerHTML =
"💡 Hint: "
+
todayPuzzle.hint;



if(answerBox){

answerBox.parentElement
.appendChild(dailyMessage);

}
