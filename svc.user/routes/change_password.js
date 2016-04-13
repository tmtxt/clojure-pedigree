'use strict';

const router = require('koa-router')();

// validation middleware
function* requireDataMdw(next) {
  const logTrace = this.logTrace;
  const body = this.request.body;
  const username = body.username;
  const oldPassword = body.oldPassword;
  const newPassword = body.newPassword;

  if (!username || !oldPassword || !newPassword) {
    let message = 'Username, oldPassword and newPassword are required';
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
function* changePasswordHandler() {
  const logTrace = this.logTrace;
  const User = this.pg.User;
  const db = this.pg.db;
  const transaction = yield db.transaction();
  const username = this.request.body.username;
  const oldPassword = this.request.body.oldPassword;
  const newPassword = this.request.body.newPassword;

  try {
    // Find user by user name
    logTrace.add('info', 'findByUsername()');
    const user = yield User.findByUsername(username);
    if (!user) {
      let message = `Cannot find user with username ${username}`;
      logTrace.add('error', message);
      throw new Error(message);
    }

    // Check if old password match
    if (!user.isPasswordMatched(oldPassword)) {
      let message = 'Old password does not match';
      logTrace.add('error', message);
      throw new Error(message);
    }

    // Update password
    logTrace.add('info', 'Update user\'s password');
    user.password = newPassword;
    yield user.save();

    const data = {
      user: user.getData()
    };
    let message = `Password updated successfully for user with username ${username}`;
    logTrace.add('info', message);
    this.body = {
      success: true,
      message,
      data
    };
  } catch(err) {
    yield transaction.rollback();
    logTrace.add('error', `Cannot find user with username ${username}`, err);
    this.body = {
      success: false,
      message: err.message
    };
  }
}

router.post('/changePassword', requireDataMdw, changePasswordHandler);

module.exports = router;
