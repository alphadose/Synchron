var peer = new Peer({key : '2pr6j8fsr9roogvi'});
var peerId;
var calls = [];
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
//var mediaDiv = '<video width="320" height="240" class = "media" controls autoplay ';
var mediaDiv = '<audio class = "media" controls autoplay ';
var numOfPeers = 0;

peer.on('open', async function(id) {
  console.log(socket.id);
  peerId = id;
  await getStream(id);
})

function getStream(id) {
  navigator.getUserMedia({video: false, audio: true}, function(stream) {
    window.localStream = stream;
    //$("#self").prop("src", URL.createObjectURL(stream));
    connectWithPeers(id);
  },
  function(err) {
    console.log(err);
  });
}

function connectWithPeers(id) {
  socket.emit('peerId', id);
  listenForCall();
  socket.on('addPeer', function(id) {
    console.log("emitted");
    callPeer(id);
  })  
}

function listenForCall() {
  console.log("listening");
  peer.on('call', function(call) {
    call.answer(window.localStream);
    call.on('stream', function(remoteStream) {
      console.log("listening and got stream");
      addMedia(remoteStream);
    });
  });
}

function callPeer(id) {
  console.log("calling");
  var call = peer.call(id, window.localStream);
  calls[numOfPeers] = call;
  calls[numOfPeers].on('stream', function(remoteStream) {
    console.log("calling and got stream");
    //calls[numOfPeers].on('stream', function(remoteStream) {
    addMedia(remoteStream);
  });
}

function addMedia(remoteStream) {
  console.log("number is " + numOfPeers);
  numOfPeers++;
  $("body").append(mediaDiv + 'id = ' + '"' + numOfPeers + '">');
  $("#" + numOfPeers).prop("src", URL.createObjectURL(remoteStream));
}
  /*
  navigator.getUserMedia({video: true, audio: true}, function(stream) {
    window.localStream = stream;
    for (var i = 0; i < members.length; i++) {
      calls[i] = peer.call(id, stream);
      calls[i].on('stream', function(remoteStream) {

      });  
    }
        var call = peer.call(id, stream);
        call.on('stream', function(remoteStream) {
          });
      },
      function(err) {
          console.log('Failed to get local stream' ,err);
      });
}
*/