'use strict';

const router = require('koa-router')();

// Koa handler function
function* getHandler() {
  const logTrace = this.logTrace;

  this.body = {
    message: 'ok'
  };
}

router.get('/tree', getHandler);

module.exports = router;
