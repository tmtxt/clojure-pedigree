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
var addUser = require('./routes/add_user.js');
var findUser = require('./routes/find_user.js');
var changePassword = require('./routes/change_password.js');
var authUser = require('./routes/auth_user.js');
var count = require('./routes/count.js');
koa.use('/user', addUser.routes(), addUser.allowedMethods());
koa.use('/user', findUser.routes(), findUser.allowedMethods());
koa.use('/user', changePassword.routes(), changePassword.allowedMethods());
koa.use('/user', authUser.routes(), authUser.allowedMethods());
koa.use('/user', count.routes(), count.allowedMethods());
var routes = koa.routes();

// create the app
new KoaApi({
  port,
  routes,
  context,
  svcName: 'svc.user'
});
