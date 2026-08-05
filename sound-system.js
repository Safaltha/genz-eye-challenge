// =================================
// 🔊 GEN Z SOUND SYSTEM
// =================================


let soundEnabled = true;


// Create sounds

const sounds = {

radar: new Audio(
"https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3"
),

hit: new Audio(
"https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3"
),

miss: new Audio(
"https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3"
),

level: new Audio(
"https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3"
)

};



// Play function

function playSound(name){

if(!soundEnabled)
return;


if(sounds[name]){

sounds[name].currentTime = 0;

sounds[name].play();

}

}



// Toggle sound

function toggleSound(){

soundEnabled = !soundEnabled;

return soundEnabled;

}
