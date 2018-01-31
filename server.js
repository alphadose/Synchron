var express = require('express');
var app = express();
var ejsLayouts = require("express-ejs-layouts");

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(ejsLayouts);
var config = require('./config/config.json');

app.listen(config.port);

app.get('/', function(req, res) {
	res.render("home");
});

app.get('/create', function(req, res) {
	res.render("create");
});

app.get('/join', function(req,  res) {
	res.render("join");
});