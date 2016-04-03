'use strict';

const router = require('koa-router')();

function* addHandler() {
  const logTrace = this.logTrace;
  const Person = this.pg.Person;
  var db = this.pg.db;
  const transaction = yield db.transaction();

  try {
    const person = Person.build(this.request.body);
    var err = yield person.validate();

    if (err) {
      logTrace.add('error', 'person.validate()', err);
      throw 'Validation fail';
    }

    yield person.save({transaction});

    transaction.commit();
    this.body = {
      success: true,
      message: 'Person inserted'
    };
  } catch (err) {
    transaction.rollback();
    this.body = {
      success: false,
      message: err
    };
    return;
  }



  if (err) {

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

router.post('/', addHandler);

module.exports = router;
