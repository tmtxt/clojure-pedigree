'use strict';

const router = require('koa-router')();

function* findRootHandler() {
  const logTrace = this.logTrace;
  const neoPerson = this.neo.person;
  const pgPerson = this.pg.Person;

  try {
    logTrace.add('info', 'neoPerson.findRoot()');
    const root = yield neoPerson.findRoot();

    if (!root) {
      throw {
        message: 'No root node found'
      };
    }

    logTrace.add('info', 'pgPerson.findOne()');
    const model = yield pgPerson.findOne({
      where: {id: root.personId}
    });

    if (!model) {
      throw {
        message: 'No model found',
        node: root
      };
    }

    let data = {
      model: model.getData(),
      node: root
    };
    logTrace.add('info', 'Root node found');
    this.body = {
      success: true,
      data
    };
  } catch (err) {
    logTrace.add('error', 'Find root fail', err);
    this.body = {
      success: false,
      message: err.message || 'Find root fail'
    };
  }
}

router.post('/root', findRootHandler);

module.exports = router;
