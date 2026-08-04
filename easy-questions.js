const easyQuestions = [

{
question:"What color is the sky on a clear day?",
options:["Blue","Green","Red","Yellow"],
answer:0
},

{
question:"How many days are there in a week?",
options:["5","6","7","8"],
answer:2
},

{
question:"Which animal says 'Meow'?",
options:["Dog","Cat","Cow","Horse"],
answer:1
},

{
question:"Which planet do we live on?",
options:["Mars","Earth","Venus","Jupiter"],
answer:1
},

{
question:"How many legs does a spider have?",
options:["4","6","8","10"],
answer:2
},

{
question:"What is 2 + 3?",
options:["4","5","6","7"],
answer:1
},

{
question:"Which fruit is yellow?",
options:["Apple","Banana","Orange","Grapes"],
answer:1
},

{
question:"How many months are in a year?",
options:["10","11","12","13"],
answer:2
},

{
question:"Which bird cannot fly?",
options:["Eagle","Penguin","Parrot","Crow"],
answer:1
},

{
question:"Which shape has 3 sides?",
options:["Square","Triangle","Circle","Rectangle"],
answer:1
},

{
question:"What is the opposite of Hot?",
options:["Warm","Cold","Big","Fast"],
answer:1
},

{
question:"Which is the largest ocean?",
options:["Atlantic","Indian","Pacific","Arctic"],
answer:2
},

{
question:"How many hours are in one day?",
options:["12","18","24","30"],
answer:2
},

{
question:"Which is a programming language?",
options:["HTML","CSS","JavaScript","All of these"],
answer:3
},

{
question:"Which animal is known as the King of the Jungle?",
options:["Tiger","Elephant","Lion","Wolf"],
answer:2
},

{
question:"Which season is the coldest?",
options:["Summer","Winter","Spring","Autumn"],
answer:1
},

{
question:"How many wheels does a bicycle have?",
options:["1","2","3","4"],
answer:1
},

{
question:"Which country is famous for the Eiffel Tower?",
options:["Italy","France","Germany","Spain"],
answer:1
},

{
question:"Which star is at the center of our solar system?",
options:["Moon","Sun","Mars","Venus"],
answer:1
},

{
question:"Which drink is made from milk?",
options:["Tea","Coffee","Milkshake","Juice"],
answer:2
}

];

let currentQuestion = 0;
let score = 0;

const questionBox = document.getElementById("question");
const optionsBox = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");

function loadQuestion(){

    let q = easyQuestions[currentQuestion];

    questionBox.innerHTML = q.question;
    optionsBox.innerHTML = "";

    q.options.forEach((option,index)=>{

        let button = document.createElement("button");
        button.innerHTML = option;

        button.onclick = function(){

            if(index === q.answer){
                score++;
                button.style.background = "green";
            }
            else{
                button.style.background = "red";
            }

            let allButtons = optionsBox.querySelectorAll("button");
            allButtons.forEach(btn=>{
                btn.disabled = true;
            });
        };

        optionsBox.appendChild(button);

    });

}


nextBtn.onclick = function(){

    currentQuestion++;

    if(currentQuestion < easyQuestions.length){
        loadQuestion();
    }
    else{
        questionBox.innerHTML = "Quiz Finished!";
        optionsBox.innerHTML = "Your Score: " + score + "/" + easyQuestions.length;
        nextBtn.style.display="none";
    }

};


loadQuestion();
