'use strict';

const router = require('koa-router')();
const _ = require('lodash');

// validation middleware
function* requireDataMdw(next) {
  const logTrace = this.logTrace;
  const body = this.request.body;
  const userData = body.user;
  const userRoleData = body.userRole;

  if (!userData) {
    let message = 'User data is required';
    logTrace.add('error', 'User data validation', message);
    this.body = {
      success: false,
      message
    };
    return;
  }

  if (!userRoleData) {
    let message = 'User Role data is required';
    logTrace.add('error', 'User Role data validation', message);
    this.body = {
      success: false,
      message
    };
    return;
  }

  yield next;
}


function* validateUser(user, logTrace) {
  var err = yield user.validate();

  if (err) {
    logTrace.add('error', 'user.validate()', err);
    throw err;
  }
}

function* validateUserRole(userRole, logTrace) {
  var err = yield userRole.validate();

  if (err) {
    logTrace.add('error', 'userRole.validate()', err);
    throw err;
  }
}

function* saveUser(user, transaction, logTrace) {
  logTrace.add('info', 'saveUser()');
  yield user.save({transaction});
}

function* saveUserRole(userRole, transaction, logTrace) {
  logTrace.add('info', 'saveUserRole()');
  yield userRole.save({transaction});
}

// Koa handler function
function* addHandler() {
  const logTrace = this.logTrace;
  const User = this.pg.User;
  const UserRole = this.pg.UserRole;
  const db = this.pg.db;
  const transaction = yield db.transaction();
  const data = this.request.body;
  const userData = data.user;
  const userRoleData = data.userRole;

  try {
    // save user first
    const user = User.build(userData);
    yield validateUser(user, logTrace);
    yield saveUser(user, transaction, logTrace);

    // save user role
    const userRole = UserRole.build(
      _.assign(userRoleData, {userId: user.id})
    );
    yield validateUserRole(userRole, logTrace);
    yield saveUserRole(userRole, transaction, logTrace);

    // commit transaction
    logTrace.add('info', 'transaction.commit()');
    yield transaction.commit();

    this.body = {
      success: true,
      message: 'User inserted',
      data: {
        user: user.getData(),
        userRole: userRole.getData()
      }
    };
  } catch(err) {
    yield transaction.rollback();
    logTrace.add('error', 'Add user handler', err);
    this.body = {
      success: false,
      message: 'Add user fail'
    };
  }
}

router.post('/add', requireDataMdw, addHandler);

module.exports = router;
