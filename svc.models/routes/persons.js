'use strict';

var router = require('koa-router')();

router.get('/', function*(next) {
  this.body = {
    hello: 'abc'
  };
});

module.exports = router;
