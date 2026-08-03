
const dailyQuestions = [

{
question:"Find the hidden object 👀",
image:"images/question1.jpg",
answer:"images/answer1.jpg",
hint:"Look carefully at the small details."
},


{
question:"Can you find the different pattern?",
image:"images/question1.jpg",
answer:"images/answer1.jpg",
hint:"Compare every corner."
},


{
question:"Test your observation skill!",
image:"images/question1.jpg",
answer:"images/answer1.jpg",
hint:"Your eyes need patience."
}


];



let today =
new Date().getDate()
% dailyQuestions.length;



let puzzle = dailyQuestions[today];



const questionImage =
document.getElementById("questionImage");

const answerImage =
document.getElementById("answerImage");

const answerBtn =
document.getElementById("answerBtn");

const answerBox =
document.getElementById("answerBox");



if(questionImage){

questionImage.src = puzzle.image;

}



if(answerImage){

answerImage.src = puzzle.answer;

}



if(answerBox){

answerBox.style.display="none";

}



if(answerBtn){


answerBtn.onclick=()=>{


answerBox.style.display="block";


answerBtn.innerText="Answer Revealed ✅";


};


}
