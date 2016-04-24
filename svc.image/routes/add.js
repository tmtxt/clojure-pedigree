'use strict';

const router = require('koa-router')();


// Koa handler function
function* addHandler() {
  const logTrace = this.logTrace;
  const User = this.pg.User;

  logTrace.add('info', 'User.count()');
  const count = yield User.count();

  let message = `Found ${count} users`;
  logTrace.add('info', message);

  const empty = count == 0;

  this.body = {
    success: true,
    message,
    data: empty
  };
}

router.get('/', addHandler);

module.exports = router;
