var clipboard = new Clipboard('.btn');
clipboard.on('success', function(e) {
	console.log("copied");
})
var socket = io();
var peer = new Peer({key : '2pr6j8fsr9roogvi'});
peer.on('open', function(id) {
	socket.emit('peerId', id);
})
socket.on('sendRoomId', function(id) {
	swal({
			title: "Room has been created",
			text: "ID : " + id,
			icon: "success",
			button: "COPY URL"
	})
	.then (() => {
		$("#copy-btn").attr("data-clipboard-text", id);
		$("#copy-btn").trigger("click");
	});
})