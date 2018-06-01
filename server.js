var express = require('express');
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
var config = require('./config/config.json');

app.listen(config.port);

app.get('/', function(req, res) {
	res.send("listening");
});