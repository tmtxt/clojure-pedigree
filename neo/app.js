var express = require('express');
var app = express();

// config
var config = require('./config/main.js');
app.set('config', config);

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var port = config.get('serverPort');

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at %s', port);
});
