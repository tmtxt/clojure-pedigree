'use strict';

const router = require('koa-router')();

// validation middleware
function* requireDataMdw(next) {
  const logTrace = this.logTrace;
  const body = this.request.body;
  const username = body.username;

  if (!username) {
    let message = 'User data is required';
    logTrace.add('error', 'User data validation', message);
    this.body = {
      success: false,
      message
    };
    return;
  }

  yield next;
}


// Koa handler function
function* findHandler() {
  const logTrace = this.logTrace;
  const User = this.pg.User;
  const UserRole = this.pg.UserRole;
  const username = this.request.body.username;

  try {
    logTrace.add('info', 'findByUsername()');
    const user = yield User.findByUsername(username);
    if (!user) {
      let message = `Cannot find user with username ${username}`;
      logTrace.add('error', message);
      throw new Error(message);
    }

    const userRole = yield UserRole.findByUserId(user.id);
    if (!userRole) {
      let message = `Cannot find user role with user id ${user.id}`;
      logTrace.add('error', message);
      throw new Error(message);
    }

    const data = {
      user: user.getData(),
      userRole: userRole.getData()
    };
    let message = `User with username ${username} found`;
    logTrace.add('info', message);
    this.body = {
      success: true,
      message,
      data
    };
  } catch(err) {
    logTrace.add('error', `Cannot find user with username ${username}`, err);
    this.body = {
      success: false,
      message: err.message
    };
  }
}

router.get('/find', requireDataMdw, findHandler);

module.exports = router;
