'use strict';

const router = require('koa-router')();

// Validate Pg model
function* validateModel(person, logTrace) {
  var err = yield person.validate();

  if (err) {
    logTrace.add('error', 'person.validate()', err);
    throw 'Validation fail';
  }
}

// Save pg model
function* savePgModel(person, transaction, logTrace) {
  yield person.save({transaction});
  logTrace.add('info', 'savePgModel()', 'Temporary save pg model');
}

// Koa handler function
function* addHandler() {
  const logTrace = this.logTrace;
  const Person = this.pg.Person;
  var db = this.pg.db;
  const transaction = yield db.transaction();

  try {
    const person = Person.build(this.request.body);
    yield validateModel(person, logTrace);
    yield savePgModel(person, transaction, logTrace);

    yield transaction.commit();
    logTrace.add('info', 'transaction.commit()');
    this.body = {
      success: true,
      message: 'Person inserted'
    };
  } catch (err) {
    yield transaction.rollback();
    logTrace.add('error', 'transaction.rollback()');
    this.body = {
      success: false,
      message: err
    };
    return;
  }
}

router.post('/', addHandler);

module.exports = router;
