'use strict';

var router = require('koa-router')();

function* add() {
  this.body = {
    get: 'true'
  };
}

router.get('/', add);

module.exports = router;
