window.onload = init;
var context;
var bufferLoader;
var queue = [];
var source;
var playing = 0;
var susresBtn = document.getElementById("pause");

function init() {
  // Fix up prefixing
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();
}

async function fetch() {

  if (playing === 1)
    return alert("Already Playing");

  if (queue.length === 0)
  	return alert("Queue is empty");

  bufferLoader = await new BufferLoader(
    context,
    [queue[0]],
    synchronise
    );

  queue.splice(0,1);
  bufferLoader.load();

}

async function add(url='audio/example.mp3') {

	await queue.push(url);
	return alert("Added");

}

async function next() {

  socket.emit('clear', roomId);
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

    playing = 1;
    source.start(0);

}

async function pauseres() {

  if(context.state === 'running') {
    context.suspend().then(function() {

      susresBtn.textContent = 'Resume';

    });

  } else if(context.state === 'suspended') {
    context.resume().then(function() {

      susresBtn.textContent = 'Pause';

    });  
  }
}