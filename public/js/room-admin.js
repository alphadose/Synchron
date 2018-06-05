var clipboard = new Clipboard('.btn');
clipboard.on('success', function(e) {
	
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