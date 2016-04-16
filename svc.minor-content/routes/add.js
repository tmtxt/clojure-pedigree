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
function* addHandler() {
  const logTrace = this.logTrace;
  const body = this.request.body;
  const key = body.key;
  const value = body.value;
  const MinorContent = this.pg.MinorContent;

  try {
    const data = {key, value};
    logTrace.add('info', 'MinorContent.build()', data);
    const minorContent = MinorContent.build(data);

    logTrace.add('info', 'minorContent.save()');
    yield minorContent.save();

    logTrace.add('info', 'minorContent.save()', 'Success');
    this.body = {
      success: true,
      message: 'Minor content created',
      data: minorContent
    };
  } catch (err) {
    logTrace.add('error', 'minorContent.save()', err);
    this.body = {
      success: false,
      message: err
    };
    return;
  }
}

router.post('/', validateMdw, addHandler);

module.exports = router;
