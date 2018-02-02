var socket = io();
  async function player(action) {

  	socket.emit('function', action);

  }

  socket.on('go', function(){

  	finishedLoading(stream);

  });

  socket.on('execute', function(action){

      switch(action) {

      	case "pauseres":
      		pauseres();
      		break;

      	case "fetch":
      		next();
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