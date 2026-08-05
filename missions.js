const missions = [
{
title:"👁️ Eye Beginner",
description:"Play 1 game",
goal:1,
progress:0,
reward:20
},

{
title:"⚡ Quick Player",
description:"Play 3 games",
goal:3,
progress:0,
reward:50
},

{
title:"🧠 Brain Master",
description:"Answer 10 questions",
goal:10,
progress:0,
reward:100
},

{
title:"🎯 Eagle Focus",
description:"Finish 5 eye challenges",
goal:5,
progress:0,
reward:150
}
];


let xp = Number(localStorage.getItem("missionXP")) || 0;


function renderMissions(){

let box=document.getElementById("missionList");

if(!box) return;


box.innerHTML="";


missions.forEach((m,index)=>{

let saved =
Number(localStorage.getItem("mission_"+index)) || 0;


box.innerHTML += `

<div class="mission-card">

<h3>${m.title}</h3>

<p>${m.description}</p>

<p>${saved}/${m.goal}</p>

<div class="mission-bar">

<div class="mission-fill" 
style="width:${(saved/m.goal)*100}%">
</div>

</div>

</div>

`;

});


document.getElementById("xp").innerHTML=xp;


}


renderMissions();
