var express = require('express');
var app = express();
var person = require('./person');

// config
var config = require('./config/main.js');
app.set('config', config);

// routes
app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.use('/person', person);

var port = config.get('serverPort');
var server = app.listen(port, function () {
  var port = server.address().port;
  console.log('Example app listening at %s', port);
});
