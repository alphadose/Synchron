var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
recognition.lang = 'en-US';
recognition.maxAlternatives = 1;
recognition.start()

recognition.onresult = function(event) {
    let direction = event.results[0][0].transcript;
    console.log("Direction is: " + direction);
    movePerson(direction);
}

recognition.onend = function(){ 
    console.log("Restarting");
    recognition.start(); 
}
