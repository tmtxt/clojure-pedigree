'use strict';

// libs
const koa = require('koa-router')();
const KoaApi = require('pd.koa.api');
const multer = require('koa-multer');

// config
const config = require('./config');
const port = config.serverPort;

// context
const context = {};

// routes
const add = require('./routes/add.js');
const deleteImage = require('./routes/delete.js');
koa.use('/add', multer({limits: '10mb'}), add.routes(), add.allowedMethods());
koa.use('/delete', deleteImage.routes(), deleteImage.allowedMethods());
const routes = koa.routes();

// create the app
new KoaApi({
  port,
  routes,
  context,
  svcName: 'svc.image'
});
