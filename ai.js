 
const askButton = document.getElementById("askAI");
const aiInput = document.getElementById("aiInput");
const aiResponse = document.getElementById("aiResponse");


const aiReplies = {

"hint":
"💡 Look carefully. Focus on small differences and hidden patterns.",

"reaction":
"⚡ Reaction tip: Keep your eyes focused and click immediately when the signal changes.",

"memory":
"🧠 Memory tip: Create a small pattern in your mind instead of memorizing randomly.",

"color":
"🎨 Color tip: Compare brightness and shade differences carefully.",

"iq":
"👁️ IQ tip: Take your time and analyze before choosing.",

"score":
"🏆 Keep playing daily to increase your score and level.",

"game":
"🎮 Available games: Reaction, Memory, Color, Hidden Number and Eye IQ."

};



askButton.addEventListener("click",()=>{


let question = aiInput.value.toLowerCase();


let answer =
"🤖 I can help with: hint, reaction, memory, color, iq, score, game";


for(let key in aiReplies){

if(question.includes(key)){

answer = aiReplies[key];

break;

}

}



aiResponse.innerHTML = answer;


});





aiInput.addEventListener("keypress",(e)=>{


if(e.key==="Enter"){

askButton.click();

}


});
