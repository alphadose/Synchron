var express = require('express');
var app = express();
var ejsLayouts = require("express-ejs-layouts");
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Room = require('./room.js');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', __dirname + '/views');
app.engine('ejs', require('express-ejs-extend'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(ejsLayouts);
var config = require('./config/config.json');

app.set('port', config.port||3000);
http.listen(app.get('port'), function() {
  console.log('Http magic is happening on port ' + app.get('port'));
});

var cluster = {};
var members = {};

app.get('/', function(req, res) {
	res.render('home');
});

app.get('/create', function(req, res) {
	res.render('credentials', { 'target' : 'create'});
})

app.get('/room', function(req, res) {
	res.render('credentials', { 'target' : 'room'});
})

app.post('/create', function(req, res) {
	res.render('room-admin', { username : req.body.username });
});

app.post('/room', function(req, res) {
	res.render('join', {
		cluster : cluster,
		username : req.body.username
	});
})

app.get('/room/:id', function(req,  res) {
	var roomId = req.params.id;
	var username = req.params.username;
	if (cluster[roomId] !== undefined) {
		res.render('room', {
			'roomId' : roomId
		});
	}
	else {
		return res.redirect('/');
	}
});

io.on('connection', function(socket) {
	var room;
	socket.on('type', function(data) {
		
		if (data.type == "admin") {
			socket.on('peerId', function(id) {
				members[socket.id] = socket.id;
				room = new Room(socket.id, id);
				cluster[socket.id] = room;
				socket.join(room.name);
				socket.emit('sendUrl', config.url + "/room/" + socket.id);
				socket.emit('store', socket.id);
			});
		}

		else if (data.type == "member") {
			var roomId = data.url;
			members[socket.id] = roomId;
			room = cluster[roomId];
			socket.join(roomId);
			socket.on('peerId', function(id) {
				console.log("emitted by " + id);
				socket.broadcast.to(room.name).emit('addPeer', id);
				room.addMember(id);
			});
		}
	});

   socket.on('disconnect', function(){
   	if (cluster[members[socket.id]] !== undefined) {
	    cluster[members[socket.id]].strength--;
	    if ( cluster[members[socket.id]].load > 0 )
	    	cluster[members[socket.id]].load--;
	    if ( cluster[members[socket.id]].strength === 0 )
	    	delete cluster[members[socket.id]];
	}
	if (members[socket.id] !== undefined) {
	    delete members[socket.id];
	}
  });

  socket.on('function', function(data){
    io.to(data.roomId).emit('execute', data.action);
  });

  socket.on('clear', function(roomId){
  	if (cluster[roomId] !== undefined)
    	cluster[roomId].load = 0;
  });

  socket.on('standby', function(roomId){
  	if (cluster[roomId] !== undefined) {
	    cluster[roomId].load++;
	    if( cluster[roomId].load === cluster[roomId].strength )
	      io.to(roomId).emit('go');
	}
  });

});
