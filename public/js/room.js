var socket = io();
var peer = new Peer({key : '2pr6j8fsr9roogvi'});
peer.on('open', function(id) {
	socket.emit('peerId', id);
})