'use strict';

const router = require('koa-router')();

// Koa handler function
function* indexHandler() {
  this.body = {
    message: 'hello',
    success: true
  };
}

router.get('/test', indexHandler);

module.exports = router;
