'use strict';

// libs
var koa = require('koa-router')();
var KoaApi = require('pd.koa.api');

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
var deleteRoute = require('./routes/delete.js');
var find = require('./routes/find.js');
var count = require('./routes/count.js');
var update = require('./routes/update.js');
koa.use('/add', add.routes(), add.allowedMethods());
koa.use('/delete', deleteRoute.routes(), deleteRoute.allowedMethods());
koa.use('/find', find.routes(), find.allowedMethods());
koa.use('/count', count.routes(), count.allowedMethods());
koa.use('/update', update.routes(), update.allowedMethods());
var routes = koa.routes();

// create the app
new KoaApi({
  port,
  routes,
  context,
  svcName: 'svc.person'
});
