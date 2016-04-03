'use strict';

var koa = require('koa-router')();
var app = require('koa')();
var config = require('./config');
var parser = require('koa-bodyparser');
var json = require('koa-json');

var logger = require('pg.logger').logger;
var koaLogTrace = require('pg.logger').koaHandler;

var persons = require('./routes/persons.js');

// global middleware
app.use(parser());
app.use(json());

app.use(koaLogTrace({
  svcName: 'svc.person'
}));

// routes definition
koa.use('/persons', persons.routes(), persons.allowedMethods());
app.use(koa.routes());

app.listen(config.serverPort);
logger.info(`Server listening on port ${config.serverPort}`, {serviceName: 'svc.person'});
