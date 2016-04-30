'use strict';

// libs
var koa = require('koa-router')();
var KoaApi = require('pd.koa.api');
var multer = require('koa-multer');

// config
var config = require('./config');
var port = config.serverPort;

// context
var context = {};

// routes
var add = require('./routes/add.js');
koa.use('/add', multer({limits: '10mb'}), add.routes(), add.allowedMethods());
var routes = koa.routes();

// create the app
new KoaApi({
  port,
  routes,
  context,
  svcName: 'svc.image'
});
