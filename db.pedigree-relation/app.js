'use strict';

// libs
var koa = require('koa-router')();
var KoaApi = require('pg.koa.api');

// config
var config = require('./config');
var port = config.serverPort;

// context
var neo4j = require('./neo4j');
var context = {
  neo: neo4j
};

// routes
var addFromFather = require('./routes/add_from_father.js');
var addFromMother = require('./routes/add_from_mother.js');
koa.use('/add', addFromFather.routes(), addFromFather.allowedMethods());
koa.use('/add', addFromMother.routes(), addFromMother.allowedMethods());
var routes = koa.routes();

// create the app
new KoaApi({
  port,
  routes,
  context,
  svcName: 'db.pedigree-relation'
});
