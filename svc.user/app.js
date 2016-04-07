'use strict';

// libs
var koa = require('koa-router')();
var KoaApi = require('pg.koa.api');

// config
var config = require('./config');
var port = config.serverPort;

// context
var postgres = require('./postgres');
var context = {
  pg: postgres
};

// routes
var addUser = require('./routes/add_user.js');
var findUser = require('./routes/find_user.js');
koa.use('/user', addUser.routes(), addUser.allowedMethods());
koa.use('/user', findUser.routes(), findUser.allowedMethods());
var routes = koa.routes();

// create the app
new KoaApi({
  port,
  routes,
  context,
  svcName: 'svc.user'
});
