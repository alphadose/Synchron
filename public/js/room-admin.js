var clipboard = new Clipboard('.btn');
var roomId;

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
});

socket.on('store', function(id){

	roomId = id;

});