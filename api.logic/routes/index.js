'use strict';

const router = require('koa-router')();

// Koa handler function
function* indexHandler() {
  this.body = {
    message: 'hello'
  };
}

router.get('/test', indexHandler);

module.exports = router;
