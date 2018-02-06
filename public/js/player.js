window.onload = init;
var context;
var subtitles;
var bufferLoader;
var queue = [];
var source;
var playing = 0;
var susresBtn = document.getElementById("pause");
var timer;
var originalTime;
var pauseTime = 0;

function init() {
  // Fix up prefixing
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();
}

async function fetch() {

  if (playing === 1)
    return toast("Already Playing");

  if (queue.length === 0)
  	return toast("Queue is empty");

  bufferLoader = await new BufferLoader(
    context,
    [queue[0]],
    synchronise
    );

  if (typeof timer !== 'undefined')
    timer.clear();

  await loadJSON(function(response) {
      subtitles = JSON.parse(response);
   }, '/audio/example.json');

  queue.splice(0,1);
  bufferLoader.load();

}

async function add(url='/audio/example.mp3') {

	await queue.push(url);
	return toast("Added");

}

async function next() {

  socket.emit('clear', roomId);

  if (typeof source !== 'undefined')
    source.onended = null;

  if (playing === 1)
  { 
    source.stop();
    playing = 0;
  }

  susresBtn.textContent = 'Pause';
	await fetch();

  if (context.state === 'suspended')
    context.resume(); 

}

async function synchronise(bufferList) {

  source = await context.createBufferSource();
  source.onended = next;
  source.buffer = bufferList[0];

  await source.connect(context.destination);
  socket.emit('standby', roomId);

}

async function finishedLoading() {

    if ( playing === 0 )
      source.start(0);

    timer = await new InvervalTimer(function () {
      displaySubtitles(subtitles);
    }, 200);

    playing = 1;

}

async function pauseres() {

  if(context.state === 'running') {
    context.suspend().then(function() {
      if (typeof timer !== 'undefined')
        timer.pause();
      if (typeof pauseTime !== 'undefined')
        pauseTime = new Date().getTime()/1000;
      susresBtn.textContent = 'Resume';

    });

  } else if(context.state === 'suspended') {
    context.resume().then(function() {
      if (typeof timer !== 'undefined')
        timer.resume();
      if (typeof originalTime !== 'undefined' && typeof pauseTime !== 'undefined')
        originalTime+= (new Date().getTime()/1000 - pauseTime);
      susresBtn.textContent = 'Pause';

    });  
  }
}

function toast(message, timeout=2000) {

  var x = document.getElementById("snackbar")
  x.innerHTML = message;

  x.className = "show";

  setTimeout(function(){ x.className = x.className.replace("show", ""); }, timeout);
}

function InvervalTimer(callback, interval) {

    var timerId, startTime, remaining = 0;
    var state = 0; //  0 = idle, 1 = running, 2 = paused, 3= resumed
    originalTime = new Date().getTime()/1000;

    this.pause = function () {
        if (state != 1) return;

        remaining = interval - (new Date() - startTime);
        window.clearInterval(timerId);
        state = 2;
    };

    this.clear = function () {
        window.clearInterval(timerId);
    };

    this.resume = function () {
        if (state != 2) return;

        state = 3;
        window.setTimeout(this.timeoutCallback, remaining);
    };

    this.timeoutCallback = function () {
        if (state != 3) return;

        callback();

        startTime = new Date();
        timerId = window.setInterval(callback, interval);
        state = 1;
    };

    startTime = new Date();
    timerId = window.setInterval(callback, interval);
    state = 1;
}

async function displaySubtitles(subs) {

  var t = new Date().getTime()/1000 - originalTime;
  var n = document.getElementById("subs");

  console.log(t);

  subtitles.forEach(function(element, index, array) {

    if( t >= element.start && t <= element.end ) {

        n.innerHTML = element.text;

    }
    
  });
}