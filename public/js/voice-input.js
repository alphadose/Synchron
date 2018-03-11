// On document load resolve the SDK dependency
function Initialize(onComplete) {
    if (!!window.SDK) {
        document.getElementById('content').style.display = 'block';
        onComplete(window.SDK);
    }
}

// Setup the recognizer
function RecognizerSetup(SDK, recognitionMode, language, format, subscriptionKey) {
    recognitionMode = SDK.RecognitionMode.Dictation;
    var recognizerConfig = new SDK.RecognizerConfig(
        new SDK.SpeechConfig(
            new SDK.Context(
                new SDK.OS(navigator.userAgent, "Browser", null),
                new SDK.Device("SpeechSample", "SpeechSample", "1.0.00000"))),
        recognitionMode,
        language, // Supported languages are specific to each recognition mode. Refer to docs.
        format); // SDK.SpeechResultFormat.Simple (Options - Simple/Detailed)


    var useTokenAuth = true;

    var authentication = function() {
        if (!useTokenAuth)
            return new SDK.CognitiveSubscriptionKeyAuthentication(subscriptionKey);

        var callback = function() {
            var tokenDeferral = new SDK.Deferred();
            try {
                var xhr = new(XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
                xhr.open('GET', '/token', 1);
                xhr.onload = function () {
                    if (xhr.status === 200)  {
                        tokenDeferral.Resolve(xhr.responseText);
                    } else {
                        tokenDeferral.Reject('Issue token request failed.');
                    }
                };
                xhr.send();
            } catch (e) {
                window.console && console.log(e);
                tokenDeferral.Reject(e.message);
            }
            return tokenDeferral.Promise();
        }

        return new SDK.CognitiveTokenAuthentication(callback, callback);
    }();

        return SDK.CreateRecognizer(recognizerConfig, authentication);
}

// Start the recognition
function RecognizerStart(SDK, recognizer) {
    recognizer.Recognize((event) => {
        /*
         Alternative syntax for typescript devs.
         if (event instanceof SDK.RecognitionTriggeredEvent)
        */
        switch (event.Name) {
            case "RecognitionTriggeredEvent" :
                UpdateStatus("Initializing");
                break;
            case "ListeningStartedEvent" :
                UpdateStatus("Listening");
                break;
            case "RecognitionStartedEvent" :
                UpdateStatus("Listening_Recognizing");
                break;
            case "SpeechStartDetectedEvent" :
                UpdateStatus("Listening_DetectedSpeech_Recognizing");
                break;
            case "SpeechHypothesisEvent" :
                console.log(JSON.stringify(event.Result)); // check console for other information in result
                break;
            case "SpeechFragmentEvent" :
                console.log(event.Result);
                movePerson(event.Result["Text"]) // check console for other information in result
                break;
            case "SpeechEndDetectedEvent" :
                OnSpeechEndDetected();
                UpdateStatus("Processing_Adding_Final_Touches");
                console.log(JSON.stringify(event.Result)); // check console for other information in result
                break;
            case "SpeechSimplePhraseEvent" :
                UpdateRecognizedPhrase(JSON.stringify(event.Result, null, 3));
                break;
            case "SpeechDetailedPhraseEvent" :
                UpdateRecognizedPhrase(JSON.stringify(event.Result, null, 3));
                break;
            case "RecognitionEndedEvent" :
                OnComplete();
                UpdateStatus("Idle");
                console.log(JSON.stringify(event)); // Debug information
                break;
            default:
                console.log(JSON.stringify(event)); // Debug information
        }
    })
    .On(() => {
        // The request succeeded. Nothing to do here.
    },
    (error) => {
        console.error(error);
    });
}

// Stop the Recognition.
function RecognizerStop(SDK, recognizer) {
    // recognizer.AudioSource.Detach(audioNodeId) can be also used here. (audioNodeId is part of ListeningStartedEvent)
    recognizer.AudioSource.TurnOff();
}
var hypothesisDiv, phraseDiv;
var key,  recognitionMode, filePicker;
var SDK;
var recognizer;
var previousSubscriptionKey;

document.addEventListener("DOMContentLoaded", function () {
    createBtn = document.getElementById("createBtn");
    phraseDiv = document.getElementById("phraseDiv");
    hypothesisDiv = document.getElementById("hypothesisDiv");

    setTimeout( function () {
            if (!recognizer) {
                Setup();
            }

            hypothesisDiv.innerHTML = "";
            phraseDiv.innerHTML = "";
            RecognizerStart(SDK, recognizer);
    },2000);



    Initialize(function (speechSdk) {
        SDK = speechSdk;
    });
});

function Setup() {
    if (recognizer != null) {
        RecognizerStop(SDK, recognizer);
    }
    recognizer = RecognizerSetup(SDK, "Dictation", "en-US", SDK.SpeechResultFormat["Simple"], "05d238d915da4838a42ab3f8fffb443e");
}

function UpdateStatus(status) {
     console.log(status);
}

function UpdateRecognizedHypothesis(text, append) {
    if (append)
        hypothesisDiv.innerHTML += text + " ";
    else
        hypothesisDiv.innerHTML = text;

    var length = hypothesisDiv.innerHTML.length;
    if (length > 403) {
        hypothesisDiv.innerHTML = "..." + hypothesisDiv.innerHTML.substr(length-400, length);
    }
}

function OnSpeechEndDetected() {
}

function UpdateRecognizedPhrase(json) {
}

function OnComplete() {
}
