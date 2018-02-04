var socket = io();

async function player(action) {

	socket.emit('function', action);

}

socket.on('go', function(){

	finishedLoading();

});

socket.on('execute', function(action){

    switch(action) {

    	case "pauseres":
    		pauseres();
    		break;

    	case "fetch":
    		fetch();
    		break;

    	case "add":
    		add();
    		break;

    	case "next":
    		next();
    		break;

    	case "default":
    		console.log("Please enter a valid action");
    		break;

    }
});