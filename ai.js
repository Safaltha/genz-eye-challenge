
const aiInput = document.getElementById("aiInput");
const askAI = document.getElementById("askAI");
const aiResponse = document.getElementById("aiResponse");



function aiAnswer(message){


message = message.toLowerCase();



if(
message.includes("hint") ||
message.includes("help")
){

return "💡 Tip: Look slowly. Many eye puzzles hide details in unexpected places.";

}



if(
message.includes("score")
){

return "🏆 Increase your score by completing challenges and keeping your streak.";

}



if(
message.includes("reaction")
){

return "⚡ For reaction games, stay focused and click as fast as possible.";

}



if(
message.includes("memory")
){

return "🧠 Memory tip: Create a pattern in your mind before answering.";

}



if(
message.includes("color")
){

return "🎨 Compare small differences between colors carefully.";

}



if(
message.includes("hard")
){

return "🔥 Hard puzzles need patience. Try again and improve your level.";

}



return "🤖 I am your Eye Coach. Ask me for hints, game tips, or challenge advice.";

}





askAI.addEventListener(
"click",
()=>{


let question =
aiInput.value;


if(question.trim()===""){


aiResponse.innerHTML =
"Please ask something first 👁️";


return;

}



aiResponse.innerHTML =
aiAnswer(question);



});





aiInput.addEventListener(
"keypress",
(e)=>{


if(e.key==="Enter"){

askAI.click();

}


});
