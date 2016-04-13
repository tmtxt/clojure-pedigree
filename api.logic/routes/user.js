'use strict';

const router = require('koa-router')();

// Koa handler function
function* authenticateHandler() {
  const logTrace = this.logTrace;
  const svcUser = this.services.user;

  try {
    const data = yield svcUser.authenticate('admin', 'admin1');
    this.body = {
      success: true,
      message: data.message
    };
  } catch (err) {
    this.body = {
      success: false,
      message: err
    };
  }
}

router.post('/authenticate', authenticateHandler);

module.exports = router;
