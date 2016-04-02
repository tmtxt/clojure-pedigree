var koa = require('koa');
var app = koa();
var config = require('./config');

app.use(function*(){
  this.body = 'Hello World';
});

app.listen(config.serverPort);
