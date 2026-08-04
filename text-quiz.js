let currentQuestions = [];

function loadLevel(level){

    if(level === "easy"){
        currentQuestions = easyQuestions;
    }

    if(level === "medium"){
        currentQuestions = mediumQuestions;
    }

    if(level === "hard"){
        currentQuestions = hardQuestions;
    }

    let q = currentQuestions[0];

    document.getElementById("questionText").innerHTML = q.question;
    document.getElementById("answerText").innerHTML = q.answer;
}
