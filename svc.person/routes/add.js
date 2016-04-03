'use strict';

const router = require('koa-router')();

function* validateModel(person, logTrace) {
  var err = yield person.validate();

  if (err) {
    logTrace.add('error', 'person.validate()', err);
    throw 'Validation fail';
  }
}

function* addHandler() {
  const logTrace = this.logTrace;
  const Person = this.pg.Person;
  var db = this.pg.db;
  const transaction = yield db.transaction();

  try {
    const person = Person.build(this.request.body);
    yield validateModel(person, logTrace);

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
}

router.post('/', addHandler);

module.exports = router;
