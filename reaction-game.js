let startTime;
let waiting = false;
let canClick = false;


const box = document.getElementById("reactionBox");
const result = document.getElementById("result");


function startReaction(){

    if(waiting){
        return;
    }


    box.innerHTML = "Wait... ⏳";
    box.style.background = "#ff4757";


    waiting = true;
    canClick = false;


    let randomTime = Math.floor(Math.random()*3000)+2000;


    setTimeout(()=>{

        box.style.background = "#2ed573";

        box.innerHTML = "CLICK NOW! ⚡";

        startTime = Date.now();

        canClick = true;


    },randomTime);

}



box.onclick = function(){


    if(!canClick){

        if(waiting){

            result.innerHTML = "Too early! Try again 😅";

        }

        return;

    }



    let reactionTime = Date.now() - startTime;


    result.innerHTML =
    "⚡ Your reaction time: "
    + reactionTime
    + " ms";


    box.innerHTML = "Click Start Again";


    box.style.background="#333";


    waiting=false;

    canClick=false;


};
