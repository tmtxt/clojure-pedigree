'use strict';

var router = require('koa-router')();

function* add() {
  var logTrace = this.logTrace;
  var Person = this.pg.Person;

  this.body = {
    aa: 'abc'
  };
}

router.get('/add', add);

module.exports = router;
