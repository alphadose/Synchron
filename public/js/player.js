window.onload = init;
var context;
var bufferLoader;
var queue = [];
var source;
var timer;
var susresBtn = document.getElementById('pause');

function init() {
  // Fix up prefixing
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();
}

function Timer(callback, delay) {
    var timerId, start, remaining = delay;

    this.pause = function() {
        window.clearTimeout(timerId);
        remaining -= new Date() - start;
    };

    this.resume = function() {
        start = new Date();
        window.clearTimeout(timerId);
        timerId = window.setTimeout(callback, remaining);
    };

    this.clear = function() {
        window.clearTimeout(timerId);
    };

    this.resume();
}

async function fetch() {
  
  if(queue.length === 0)
  	return alert("List is empty");

  bufferLoader = await new BufferLoader(
    context,
    [queue[0]],
    finishedLoading
    );

  queue.splice(0,1);
  bufferLoader.load();
}

async function add(url='audio/example.mp3') {

	await queue.push(url);
	alert("Added");
}

async function next() {

	await timer.clear();
	await source.stop();
  susresBtn.textContent = 'Pause';
	await fetch();
  if(context.state === 'suspended')
    context.resume(); 
}

async function finishedLoading(bufferList) {

  source = await context.createBufferSource();
  source.buffer = bufferList[0];

  await source.connect(context.destination);
  source.start(0);
  timer = new Timer(next, duration);
}

async function pauseres() {

  if(context.state === 'running') {
    context.suspend().then(async function() {

      await timer.pause();
      susresBtn.textContent = 'Resume';

    });
  } else if(context.state === 'suspended') {
    context.resume().then(async function() {

      await timer.resume();
      susresBtn.textContent = 'Pause';

    });  
  }
}