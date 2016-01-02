// express
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// handler
var person = require('./person');

// config
var config = require('./config/main.js');
app.set('config', config);

// database
var neo4j = require('./database/neo4j.js').init(config);
var query = require('./query');
app.set('neo4j', neo4j);
app.set('query', query);

// plugin
app.use(bodyParser.json());

// routes
app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.use('/person', person);

// start server
var port = config.get('serverPort');
var server = app.listen(port, function () {
  var port = server.address().port;
  console.log('Example app listening at %s', port);
});
