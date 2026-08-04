 
// ======================================
// 🤖 GEN Z EYE CHALLENGE AI COACH
// ======================================


const askButton = document.getElementById("askAI");
const aiInput = document.getElementById("aiInput");
const aiResponse = document.getElementById("aiResponse");


// AI KNOWLEDGE

const aiReplies = {

hint: function(){

    let hint = localStorage.getItem("dailyHint");

    return hint
    ? "💡 Hint: " + hint
    : "💡 Look carefully at hidden objects, patterns and small differences.";

},


answer: function(){

    return "👁️ Try finding the answer yourself first. Training your eyes improves your skill!";
},


reaction: function(){

    return "⚡ Reaction tip: Stay focused and click as soon as the signal changes.";
},


memory: function(){

    return "🧠 Memory tip: Remember positions and patterns instead of random icons.";
},


color: function(){

    return "🎨 Color tip: Compare shade, brightness and tiny color changes.";
},


iq: function(){

    return "👁️ IQ tip: Observe carefully before selecting your answer.";
},


score: function(){

    let score =
    localStorage.getItem("bestScore") || 0;

    return "🏆 Best Score: " + score;
},


level: function(){

    let level =
    localStorage.getItem("level") || 1;

    return "🔥 Current Level: " + level;
},


game: function(){

    return `
🎮 Games Available:

👁️ Eye Challenge
🧠 Memory Match
⚡ Reaction Test
🎨 Color Detector
🔢 Hidden Number
❌⭕ Tic Tac Toe
♟️ Chess
🎲 Ludo
`;
},


profile: function(){

    let name =
    document.getElementById("playerName")?.innerHTML || "Guest";

    return "👤 Player: " + name;
},


help: function(){

    return `
🤖 Ask me about:

💡 hint
🏆 score
🔥 level
🎮 game
🧠 memory
⚡ reaction
🎨 color
👁️ iq
`;
}

};




// ASK AI

if(askButton){

askButton.onclick = function(){

let question =
aiInput.value.toLowerCase();


let answer =
"🤖 Try asking: hint, score, game, memory, reaction or color.";


for(let key in aiReplies){

    if(question.includes(key)){

        answer =
        aiReplies[key]();

        break;

    }

}


aiResponse.innerHTML = answer;


};

}



// ENTER BUTTON

if(aiInput){

aiInput.addEventListener(
"keypress",
function(event){

if(event.key === "Enter"){

askButton.click();

}

});

}



// READY MESSAGE

if(aiResponse){

aiResponse.innerHTML =
"🤖 AI Eye Coach Ready 👁️";

}