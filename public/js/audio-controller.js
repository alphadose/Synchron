async function player(action, song='example') {


	socket.emit('function', {
        action : action,
        roomId : roomId,
        song : song
    });

}

socket.on('go', function(){

	finishedLoading();

});

socket.on('execute', function(data){

    switch(data.action) {

    	case "pauseres":
    		pauseres();
    		break;

    	case "fetch":
    		fetch();
    		break;

    	case "add":
    		add(data.song);
    		break;

    	case "next":
    		next();
    		break;

    	case "default":
    		console.log("Please enter a valid action");
    		break;

    }
});