let currentQuestion = 0;
let score = 0;

const image = document.getElementById("question-image");
const question = document.getElementById("question-text");
const options = document.getElementById("options");
const message = document.getElementById("message");
const nextBtn = document.getElementById("next-btn");
const scoreText = document.getElementById("score");
const questionCount = document.getElementById("question-count");

function loadQuestion() {

    let q = hiddenNumberQuestions[currentQuestion];

    image.src = q.image;
    question.innerHTML = q.question;
    questionCount.innerHTML = "Question " + (currentQuestion + 1);

    options.innerHTML = "";
    message.innerHTML = "";
    nextBtn.style.display = "none";

    q.options.forEach((option, index) => {

        let btn = document.createElement("button");
        btn.innerHTML = option;

        btn.onclick = function () {

            if (index === q.answer) {

                btn.classList.add("correct");

                message.innerHTML = "✅ Correct!";

                score++;
                scoreText.innerHTML = "Score: " + score;

                document.querySelectorAll("#options button").forEach(b => b.disabled = true);

                nextBtn.style.display = "block";

            } else {

                btn.classList.add("wrong");

                btn.disabled = true;

                message.innerHTML = "❌ Try Again!";
            }

        };

        options.appendChild(btn);

    });

}

nextBtn.onclick = function () {

    currentQuestion++;

    if (currentQuestion < hiddenNumberQuestions.length) {

        loadQuestion();

    } else {

        image.style.display = "none";
        question.innerHTML = "🎉 Game Finished!";
        options.innerHTML = "";
        message.innerHTML = "Your Score: " + score + " / " + hiddenNumberQuestions.length;
        nextBtn.style.display = "none";

    }

};

loadQuestion();
