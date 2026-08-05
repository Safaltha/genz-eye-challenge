// Mission Mode

const missions = [
{
title:"👁️ Eye Beginner",
description:"Play 1 game",
goal:1,
progress:0,
reward:20,
completed:false
},

{
title:"⚡ Quick Player",
description:"Play 3 games",
goal:3,
progress:0,
reward:50,
completed:false
},

{
title:"🧠 Brain Master",
description:"Answer 10 questions",
goal:10,
progress:0,
reward:100,
completed:false
},

{
title:"🎯 Eagle Focus",
description:"Finish 5 eye challenges",
goal:5,
progress:0,
reward:150,
completed:false
},

{
title:"🔥 Daily Hero",
description:"Complete all missions",
goal:5,
progress:0,
reward:300,
completed:false
}
];

let playerXP = 0;

function updateMission(index, amount = 1){

if(missions[index].completed) return;

missions[index].progress += amount;

if(missions[index].progress >= missions[index].goal){

missions[index].completed = true;

playerXP += missions[index].reward;

alert("🎉 Mission Complete!\n\n"+missions[index].title+"\n+"+missions[index].reward+" XP");

}

renderMissions();

}

function renderMissions(){

const box = document.getElementById("missionList");

if(!box) return;

box.innerHTML = "";

missions.forEach((m)=>{

box.innerHTML += `
<div class="mission-card">

<h3>${m.title}</h3>

<p>${m.description}</p>

<p>${m.progress}/${m.goal}</p>

<div class="mission-bar">
<div class="mission-fill" style="width:${(m.progress/m.goal)*100}%"></div>
</div>

${m.completed ? "<span>✅ Completed</span>" : ""}

</div>
`;

});

const xp = document.getElementById("xp");

if(xp) xp.innerText = playerXP;

}

window.onload = renderMissions;
