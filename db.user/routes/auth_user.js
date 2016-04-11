'use strict';

const router = require('koa-router')();

// validation middleware
function* requireDataMdw(next) {
  const logTrace = this.logTrace;
  const body = this.request.body;
  const username = body.username;
  const password = body.password;

  if (!username || !password) {
    let message = 'Username and password are required';
    logTrace.add('error', 'Data validation', message);
    this.body = {
      success: false,
      message
    };
    return;
  }

  yield next;
}


// Koa handler function
function* authHandler() {
  const logTrace = this.logTrace;
  const User = this.pg.User;
  const db = this.pg.db;
  const transaction = yield db.transaction();
  const username = this.request.body.username;
  const password = this.request.body.password;

  try {
    // Find user name by id
    logTrace.add('info', 'findByUsername()');
    const user = yield User.findByUsername(username);
    if (!user) {
      let message = `Cannot find user with username ${username}`;
      logTrace.add('error', message);
      throw new Error(message);
    }

    // Check if password match
    if (!user.isPasswordMatched(password)) {
      let message = 'Password does not match';
      logTrace.add('error', message);
      throw new Error(message);
    }

    let message = `Auth successful for user with username ${username}`;
    logTrace.add('info', message);
    this.body = {
      success: true,
      message
    };
  } catch(err) {
    yield transaction.rollback();
    logTrace.add('error', `Auth not successful for user with username ${username}`, err);
    this.body = {
      success: false,
      message: err.message
    };
  }
}

router.post('/auth', requireDataMdw, authHandler);

module.exports = router;
