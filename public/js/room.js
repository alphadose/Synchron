var socket = io();
var peer = new Peer({key : '2pr6j8fsr9roogvi'});
peer.on('open', function(id) {
	socket.emit('peerId', id);
})

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
peer.on('call', function(call) {
  navigator.getUserMedia({video: true, audio: true}, function(stream) {
    call.answer(stream); // Answer the call with an A/V stream.
    call.on('stream', function(remoteStream) {
      // Show stream in some video/canvas element.
      console.log("received");
    });
  }, function(err) {
    console.log('Failed to get local stream' ,err);
  });
});