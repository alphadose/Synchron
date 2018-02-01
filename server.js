var express = require('express');
var app = express();
var ejsLayouts = require("express-ejs-layouts");
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Room = require('./room.js');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(ejsLayouts);
var config = require('./config/config.json');
app.set('port', config.port||3000);
http.listen(app.get('port'), function() {
	console.log("http server listening at port " + app.get('port'));
});

var cluster = {};
app.get('/', function(req, res) {
	res.render('home');
});

app.get('/create', function(req, res) {
	res.render('room-admin');
	io.on('connection', function(socket) {
		socket.on('peerId', function(id) {
			var room = new Room(id);
			cluster[id] = room;
			socket.emit('sendRoomId', id);
		});
	});
});

app.get('/room/:id', function(req,  res) {
	var roomId = req.params.id;
	if (cluster[roomId] !== undefined) {
		var room = cluster[roomId];
		res.render("room");
		io.on('connection', function(socket) {
			socket.on('peerId', function(id) {
				room.addMember(id);
			});
		})
	}
	else {
		return res.redirect('/');
	}
});
