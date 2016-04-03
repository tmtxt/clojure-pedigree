'use strict';

var koa = require('koa-router')();
var app = require('koa')();
var config = require('./config');
var parser = require('koa-bodyparser');
var json = require('koa-json');
var LogTrace = require('./logger');

var persons = require('./routes/persons.js');

// global middleware
app.use(parser());
app.use(json());

app.use(function *(next){
  var logTrace = new LogTrace();
  this.logTrace = logTrace;
  yield next;
  logTrace.write();
});

// routes definition
koa.use('/persons', persons.routes(), persons.allowedMethods());
app.use(koa.routes());

app.listen(config.serverPort);
console.log(`Server listening on port ${config.serverPort}`);
