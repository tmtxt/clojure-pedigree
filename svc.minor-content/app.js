'use strict';

// libs
var koa = require('koa-router')();
var KoaApi = require('pd.koa.api');

// config
var config = require('./config');
var port = config.serverPort;

// context
var postgres = require('./postgres');
var context = {
  pg: postgres
};

// routes
var add = require('./routes/add.js');
var find = require('./routes/find.js');
koa.use('/add', add.routes(), add.allowedMethods());
koa.use('/find', find.routes(), find.allowedMethods());
var routes = koa.routes();

// create the app
new KoaApi({
  port,
  routes,
  context,
  svcName: 'svc.minor-content'
});
