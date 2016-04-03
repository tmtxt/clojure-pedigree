'use strict';

const router = require('koa-router')();

function* add() {
  const logTrace = this.logTrace;
  const Person = this.pg.Person;

  const person = Person.build(this.request.body);
  var err = yield person.validate();

  if (err) {
    logTrace.add('error', 'person.validate()', err);
    this.body = {
      success: false,
      message: 'Validation fail'
    };
    return;
  }

  this.body = {
    get: 'true'
  };
}

router.post('/', add);

module.exports = router;
