'use strict';

// libs
var koa = require('koa-router')();
var KoaApi = require('pg.koa.api');

// config
var config = require('./config');
var port = config.serverPort;

// context
var postgres = require('./postgres');
var neo4j = require('./neo4j');
var context = {
  pg: postgres,
  neo: neo4j
};

// routes
var add = require('./routes/add.js');
koa.use('/add', add.routes(), add.allowedMethods());
var routes = koa.routes();

// create the app
new KoaApi({
  port,
  routes,
  context,
  svcName: 'svc.person'
});
