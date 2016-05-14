'use strict';

const router = require('koa-router')();

// Koa handler function
function* getHandler() {
  const logTrace = this.logTrace;

  this.body = {
    success: true,
    data: "tree"
  };
}

router.post('/get', getHandler);

module.exports = router;
