 
const askButton = document.getElementById("askAI");
const aiInput = document.getElementById("aiInput");
const aiResponse = document.getElementById("aiResponse");


if(askButton){

askButton.onclick = function(){

let question = aiInput.value.toLowerCase();


if(question.includes("hint")){

aiResponse.innerHTML =
"💡 AI Hint: Look carefully at corners, colors and small details.";

}

else if(question.includes("reaction")){

aiResponse.innerHTML =
"⚡ Tip: Stay focused and click as soon as the signal appears.";

}

else if(question.includes("memory")){

aiResponse.innerHTML =
"🧠 Tip: Remember patterns by grouping numbers together.";

}

else if(question.includes("score")){

aiResponse.innerHTML =
"🏆 Keep playing daily challenges to improve your score.";

}

else if(question.includes("hello") || question.includes("hi")){

aiResponse.innerHTML =
"🤖 Hello! I am your Eye Challenge Coach. Ask me for hints or tips.";

}

else{

aiResponse.innerHTML =
"🤖 I can help with: hint, reaction, memory, score, games.";

}

};

}
