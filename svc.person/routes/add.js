'use strict';

const router = require('koa-router')();
const _ = require('lodash');

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
  logTrace.add('info', 'savePgModel()', 'Temporary save pg model');
  yield person.save({transaction});
}

// Add person node in neo4j
function* addNode(person, isRoot, neoPerson, logTrace) {
  logTrace.add('info', 'addNode()', 'Saving person node to neo4j');
  yield neoPerson.save(person, isRoot);
}

// Koa handler function
function* addHandler() {
  const logTrace = this.logTrace;
  const Person = this.pg.Person;
  var db = this.pg.db;
  var neoPerson = this.neo.person;
  const transaction = yield db.transaction();
  const personData = this.request.body;
  const isRoot = personData.isRoot || false;

  try {
    const person = Person.build(personData);
    yield validateModel(person, logTrace);
    yield savePgModel(person, transaction, logTrace);
    yield addNode(person, isRoot, neoPerson, logTrace);

    yield transaction.commit();
    logTrace.add('info', 'transaction.commit()');
    this.body = {
      success: true,
      message: 'Person inserted',
      data: person.getData()
    };
  } catch (err) {
    yield transaction.rollback();
    logTrace.add('error', 'transaction.rollback()', err);
    this.body = {
      success: false,
      message: err
    };
    return;
  }
}

router.post('/', addHandler);

module.exports = router;
