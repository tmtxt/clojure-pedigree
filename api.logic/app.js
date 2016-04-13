'use strict';

// libs
var koa = require('koa-router')();
var KoaApi = require('pd.koa.api');

// config
var config = require('./config');
var port = config.serverPort;

// context
var services = require('./services');
var context = {
  services: services
};

// routes
const user = require('./routes/user.js');
koa.use('/user', user.routes(), user.allowedMethods());
const routes = koa.routes();

// create the app
new KoaApi({
  port,
  routes,
  context,
  svcName: 'api.logic'
});
