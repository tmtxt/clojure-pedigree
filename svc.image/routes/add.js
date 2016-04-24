'use strict';

const router = require('koa-router')();
const uuid = require('node-uuid');
const _ = require('lodash');

const types = ['person'];

function* validateMdw(next) {
  const logTrace = this.logTrace;
  const type = _.get(this, ['request', 'body', 'type']);
  const image = _.get(this, ['req', 'files', 'image']);

  if (_.isNil(type) || !_.includes(types, type)) {
    let message = 'Invalid image type';
    logTrace.add('error', 'Image type validation', message);
    this.body = {
      success: false,
      message
    };
    return;
  }

  if (_.isNil(image) || _.isNil(image.path)) {
    let message = 'No image uploaded';
    logTrace.add('error', 'Image file validation', message);
    this.body = {
      success: false,
      message
    };
    return;
  }

  yield next;
}

// Koa handler function
function* addHandler() {
  const logTrace = this.logTrace;
  // const User = this.pg.User;

  // logTrace.add('info', 'User.count()');
  // const count = yield User.count();

  // let message = `Found ${count} users`;
  // logTrace.add('info', message);

  // const empty = count == 0;

  // this.body = {
  //   success: true,
  //   message,
  //   data: empty
  // };
  this.body = {
    success: true
  };
}

router.post('/', validateMdw, addHandler);

module.exports = router;
