'use strict';

const router = require('koa-router')();
const _ = require('lodash');

// Middleware for validating data
function* validateMdw(next) {
  const logTrace = this.logTrace;
  const body = this.request.body;
  const key = body.key;

  if (_.isNil(key)) {
    let message = 'Minor content key is required';
    logTrace.add('error', 'Validate minor content key', message);
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
  const key = this.request.body.key;
  const MinorContent = this.pg.MinorContent;

  try {
    logTrace.add('info', 'MinorContent.findByKey()', key);
    const minorContent = yield MinorContent.findByKey(key);

    if (!minorContent) {
      logTrace.add('error', 'MinorContent.findByKey()', 'Cannot find');
      throw `Cannot find minor content value with key ${key}`;
    }

    logTrace.add('info', 'MinorContent.findByKey()', 'Success');
    this.body = {
      success: true,
      message: 'Minor content found',
      data: minorContent.getData()
    };
  } catch (err) {
    logTrace.add('error', 'MinorContent.findByKey()', err);
    this.body = {
      success: false,
      message: err
    };
    return;
  }
}

router.get('/', validateMdw, findHandler);

module.exports = router;
