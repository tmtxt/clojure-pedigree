'use strict';

const router = require('koa-router')();

// Middleware for validating data
function* validateMdw(next) {
  const logTrace = this.logTrace;
  const body = this.request.body;
  const key = body.key;
  const value = body.value;

  if (!key || !value) {
    let message = 'Minor content key and value are required';
    logTrace.add('error', 'Validate minor content key and value', message);
    this.body = {
      success: false,
      message
    };
    return;
  }

  yield next;
}

// Koa handler function
function* updateHandler() {
  const logTrace = this.logTrace;
  const body = this.request.body;
  const key = body.key;
  const value = body.value;
  const MinorContent = this.pg.MinorContent;

  try {
    logTrace.add('info', 'MinorContent.findByKey()', key);
    const minorContent = yield MinorContent.findByKey(key);

    if (!minorContent) {
      logTrace.add('error', 'MinorContent.findByKey()', 'Cannot find');
      throw `Cannot find minor content value with key ${key}`;
    }

    minorContent.value = value;
    logTrace.add('info', 'minorContent.save()');
    yield minorContent.save();

    logTrace.add('info', 'minorContent.save()', 'Success');
    this.body = {
      success: true,
      message: 'Minor content created',
      data: minorContent.getData()
    };
  } catch (err) {
    logTrace.add('error', 'updateHandler()', err);
    this.body = {
      success: false,
      message: err
    };
    return;
  }
}

router.post('/', validateMdw, updateHandler);

module.exports = router;
