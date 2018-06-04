var clipboard = new Clipboard('.btn');
clipboard.on('success', function(e) {
	
})
var socket = io();
var peer = new Peer({key : '2pr6j8fsr9roogvi'});
peer.on('open', function(id) {
	socket.emit('peerId', id);
})
socket.on('sendUrl', function(url) {
	swal({
			title: "Room has been created",
			text: "Share the url with your friends!",
			icon: "success",
			button: "COPY URL"
	})
	.then (() => {
		$("#copy-btn").attr("data-clipboard-text", url);
		$("#copy-btn").trigger("click");
	});
})

socket.on('addPeer', function(id) {
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	navigator.getUserMedia({video: true, audio: true}, function(stream) {
		var call = peer.call(id, stream);
		call.on('stream', function(remoteStream) {
    		var media = document.getElementById('media');
    		media.src = window.url.createObjectURL(remoteStream);
  		});
	},
	function(err) {
  		console.log('Failed to get local stream' ,err);
	});
})