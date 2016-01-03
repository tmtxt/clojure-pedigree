// express
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// handler
var person = require('./person');
var pedigree = require('./pedigree');
var marriage = require('./marriage');

// config
var config = require('./config/main.js');
app.set('config', config);

// database
var neo4j = require('./database/neo4j.js').init(config);
var query = require('./query');
app.set('neo4j', neo4j);
app.set('query', query);

// util
var util = require('./util');
app.set('util', util);

// plugin
app.use(bodyParser.json());

// routes
app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.use('/person', person);
app.use('/pedigree', pedigree);
app.use('/marriage', marriage);

// start server
var port = config.get('serverPort');
var server = app.listen(port, function () {
  var port = server.address().port;
  console.log('Example app listening at %s', port);
});
