var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
recognition.lang = 'en-US';
recognition.maxAlternatives = 1;
recognition.start()

recognition.onresult = async function(event) {
    let command = event.results[0][0].transcript;
    console.log("Direction is: " + command);
    filter(command);
    movePerson(command);
}

recognition.onend = async function(){
    console.log("Restarting");
    recognition.start(); 
}

async function filter(command) {
    let song;
    console.log("Command is "+command);
    if(command.match(/add/gi)) {
        if(command.match(/wake/gi) && command.match(/me/gi) && command.match(/up/gi))
            song = "Wake_Me_Up";
        else if(command.match(/demons/gi))
            song = "Demons";
        else if(command.match(/blood/gi) || command.match(/stream/gi))
            song = "Bloodstream";
        else if(command.match(/blank/gi) && command.match(/space/gi))
            song = "Blank_Space";
        console.log(song);
        if(song != undefined)
            player("add", song);
    }
    else if(command.match(/play/gi))
        player("fetch");
    else if(command.match(/pause/gi) || command.match(/resume/gi) || command.match(/paws/gi))
        player("pauseres");
    else if(command.match(/next/gi))
        player("next");
}
