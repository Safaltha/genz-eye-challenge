let correct =
colors[Math.floor(Math.random()*colors.length)];


let answer =
prompt(
"Find this color: "
+ correct
);


if(answer &&
answer.toLowerCase()
===
correct.toLowerCase()){


alert("Perfect 👁️");

addScore(25);


}

else{

alert("Try again");

}


}








function numberGame(){


let secret =
Math.floor(Math.random()*10)+1;


let guess =
prompt(
"Guess number 1-10"
);


if(Number(guess)===secret){

alert("Amazing!");

addScore(40);

}

else{

alert(
"Wrong number. It was "
+secret
);

}


}







function objectGame(){

alert(
"Find the hidden object challenge coming soon 🔍"
);

addScore(10);

}







function eyeIQ(){

let iq =
Math.floor(Math.random()*50)+50;


alert(
"Your Eye IQ score: "
+iq
);


addScore(15);


}






document.getElementById("resetBtn")
.addEventListener("click",()=>{


localStorage.clear();


score=0;
streak=0;
level=1;


updateStats();


alert("Progress reset");


});


