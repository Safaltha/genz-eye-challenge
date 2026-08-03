
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

return "⚡ For reaction games, stay focused a
});
