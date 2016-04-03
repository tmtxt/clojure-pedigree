'use strict';

var router = require('koa-router')();

router.get('/', function*(next) {
  var logTrace = this.logTrace;
  logTrace.add('info', 'start function', 'hello');
  logTrace.add('info', 'next function', 'next next');

  this.body = {
    hello: 'abc'
  };
  logTrace.add('info', 'finish', 'already finish');
});

module.exports = router;
