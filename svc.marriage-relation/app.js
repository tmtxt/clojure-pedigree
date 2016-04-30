'use strict';

// libs
var koa = require('koa-router')();
var KoaApi = require('pd.koa.api');

// config
var config = require('./config');
var port = config.serverPort;

// context
var neo4j = require('./neo4j');
var context = {
  neo: neo4j
};

// routes
var add = require('./routes/add.js');
var findPartners = require('./routes/find_partners.js');
var detect = require('./routes/detect.js');
koa.use('/add', add.routes(), add.allowedMethods());
koa.use('/find', findPartners.routes(), findPartners.allowedMethods());
koa.use('/detect', detect.routes(), detect.allowedMethods());
var routes = koa.routes();

// create the app
new KoaApi({
  port,
  routes,
  context,
  svcName: 'svc.marriage-relation'
});
