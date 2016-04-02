var koa = require('koa-router')();
var app = require('koa')();
var config = require('./config');
var parser = require('koa-bodyparser');
var json = require('koa-json');
var winston = require('winston');

var persons = require('./routes/persons.js');

// global middleware
app.use(parser());
app.use(json());

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

// routes definition
koa.use('/persons', persons.routes(), persons.allowedMethods());
app.use(koa.routes());

app.listen(config.serverPort);
console.log(`Server listening on port ${config.serverPort}`);
