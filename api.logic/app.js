'use strict';

// libs
var koa = require('koa-router')();
var KoaApi = require('pg.koa.api');

// config
var config = require('./config');
var port = config.serverPort;

// context
var context = {};

// routes
var index = require('./routes/index.js');
koa.use('/user', index.routes(), index.allowedMethods());
var routes = koa.routes();

// create the app
new KoaApi({
  port,
  routes,
  context,
  svcName: 'api.logic'
});
