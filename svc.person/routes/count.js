'use strict';

const router = require('koa-router')();


// Koa handler function
function* countHandler() {
  const logTrace = this.logTrace;
  const Person = this.pg.Person;

  logTrace.add('info', 'Person.count()');
  const count = yield Person.count();

  let message = `Found ${count} persons`;
  logTrace.add('info', message);

  this.body = {
    success: true,
    message,
    data: count
  };
}

router.get('/', countHandler);

module.exports = router;
