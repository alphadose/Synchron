var express = require('express');
var app = express();
var ejsLayouts = require("express-ejs-layouts");
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Room = require('./room.js');
var ExpressPeerServer = require('peer').ExpressPeerServer;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

var options = {
    debug: true
};
app.use('/peerjs', ExpressPeerServer(http, options));
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
var cookieName = "username";

app.get('/', function(req, res) {
	res.render('home');
});

app.get('/create', function(req, res) {
	if (req.cookies[cookieName] !== undefined) {
		return res.render('room-admin'); 
	}
	return res.render('credentials', { 'target' : 'create' });
})

app.get('/room', function(req, res) {
	if (req.cookies[cookieName] !== undefined) {
		return res.render('join', {
			cluster : cluster,
			username : req.cookies[cookieName]
		})
	}
	res.render('credentials', { 'target' : 'room' });
})

app.post('/create', function(req, res) {
	res.cookie(cookieName, req.body.username, { maxAge: 900000, httpOnly: false });
	return res.render('room-admin');
});

app.post('/room', function(req, res) {
	res.cookie(cookieName, req.body.username, { maxAge: 900000, httpOnly: false });
	return res.render('join', {
		cluster : cluster,
		username : req.body.username
	});
})

app.get('/room/:id', function(req, res) {
	var roomId = req.params.id;
	if (cluster[roomId] !== undefined) {
		if (req.cookies[cookieName] !== undefined) {
			return res.render('room', {
				'roomId' : roomId
			});
		}
		else {
			return res.render('credentials', { target : 'room/' + roomId });
		}
	}
	else {
		return res.redirect('/');
	}
})

app.post('/room/:id', function(req,  res) {
	res.cookie(cookieName, req.body.username, { maxAge: 900000, httpOnly: false });
	var roomId = req.params.id;
	if (cluster[roomId] !== undefined) {
			return res.render('room', {
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
				room = new Room(socket.id, id, data.username);
				cluster[socket.id] = room;
				socket.join(room.name);
			});
		
			socket.emit('store', socket.id);
		}

		else if (data.type == "member") {
			var roomId = data.url;
			members[socket.id] = roomId;
			room = cluster[roomId];
			socket.join(roomId);
			socket.on('peerId', function(id) {
				console.log("emitted by " + id);
				if( typeof room !== 'undefined'){
				socket.broadcast.to(room.name).emit('addPeer', {
					id : id,
					newMember : username
				});
				room.addMember(id, data.username);}
			});
		}
	});

   socket.on('disconnect', async function(){
   	console.log(cluster);
   	console.log(members);
   	if (typeof cluster[members[socket.id]] !== 'undefined') {
   		cluster[members[socket.id]].removeMember(socket.id);

    if ( cluster[members[socket.id]].strength === 0 )
    	await delete cluster[members[socket.id]];
	}

	if (typeof members[socket.id] !== 'undefined')
    	delete members[socket.id];
    
  });

  socket.on('function', function(data){
	console.log(data);
console.log("emitting");
    io.to(data.roomId).emit('execute', { action : data.action,
    									 song : data.song } );
  });

  socket.on('clear', function(roomId){
  	if (cluster[roomId] !== undefined)
    	cluster[roomId].load = 0;
  });

  socket.on('standby', function(roomId){
console.log("roomid"+roomId);
console.log(cluster);

  	if (cluster[roomId] !== undefined) {
	    cluster[roomId].load++;
	    if( cluster[roomId].load === cluster[roomId].strength )
	      io.to(roomId).emit('go');
	}
  });

});
