'use strict';

const router = require('koa-router')();

// Koa handler function
function* authenticateHandler() {
  const logTrace = this.logTrace;
  const svcUser = this.services.user;

  const data = yield svcUser.authenticate('admin', 'admin');

  this.body = {
    data,
    success: true
  };
}

router.post('/authenticate', authenticateHandler);

module.exports = router;
