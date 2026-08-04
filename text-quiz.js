let currentQuestions = [];
let currentIndex = 0;
let score = 0;


function loadLevel(level){

    if(level === "easy"){
        currentQuestions = easyQuestions;
    }

    else if(level === "medium"){
        currentQuestions = mediumQuestions;
    }

    else if(level === "hard"){
        currentQuestions = hardQuestions;
    }

    document.getElementById("difficulty-screen").style.display="none";
    document.getElementById("quiz-screen").style.display="block";

    currentIndex = 0;
    score = 0;

    showQuestion();
}


function showQuestion(){

    let q = currentQuestions[currentIndex];

    document.getElementById("question").innerHTML = q.question;

    let answers = document.getElementById("answers");
    answers.innerHTML="";


    q.options.forEach((option,index)=>{

        let btn=document.createElement("button");

        btn.innerHTML=option;

        btn.onclick=function(){

            if(index === q.answer){
                score++;
                btn.classList.add("correct");
            }
            else{
                btn.classList.add("wrong");
            }

            document.querySelectorAll("#answers button")
            .forEach(b=>b.disabled=true);

        };

        answers.appendChild(btn);

    });

}


document.getElementById("next-btn").onclick=function(){

    currentIndex++;

    if(currentIndex < currentQuestions.length){
        showQuestion();
    }
    else{
        document.getElementById("question").innerHTML =
        "Quiz Finished! Score: "+score;

        document.getElementById("answers").innerHTML="";
    }

};
