'use strict';

const router = require('koa-router')();
const _ = require('lodash');

// Koa handler function
function* updateHandler() {
  const logTrace = this.logTrace;
  const Person = this.pg.Person;
  const personData = this.request.body;
  const personId = personData.id;

  // check for person id
  if (_.isNil(personId)) {
    const message = 'Person id is required';
    logTrace.add('error', 'updateHandler()', message);
    throw new Error(message);
  }

  // update person data
  const dbRes = yield Person.update(
    _.omit(personData, ['id']),
    { where: { id: personId } }
  );
  logTrace.add('info', 'updateHandler()', `Person with id ${personId} updated`);

  // return
  this.body = {
    success: true,
    data: {
      affectedCount: dbRes[0]
    }
  };
}

router.post('/', updateHandler);

module.exports = router;
