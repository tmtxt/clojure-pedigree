'use strict';

const router = require('koa-router')();

// Koa handler function
function* authenticateHandler() {
  this.body = {
    message: 'hello',
    success: true
  };
}

router.post('/authenticate', authenticateHandler);

module.exports = router;
