'use strict';

const router = require('koa-router')();
const util = require('./util.js');

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

function* findByIdHandler() {
  var logTrace = this.logTrace;
  var personId = this.request.body.personId;
  personId = parseInt(personId);
  var pgPerson = this.pg.Person;
  var neoPerson = this.neo.person;

  try {
    logTrace.add('info', 'pgPerson.findById()');
    const model = yield pgPerson.findById(personId);
    if (!model) {
      throw {message: `Cannot find model with id ${personId}`};
    }

    const node = yield neoPerson.find(personId);
    if (!node) {
      throw {message: `Cannot find node with id ${personId}`};
    }

    logTrace.add('info', `Person with id ${personId} found`);
    this.body = {
      success: true,
      data: {
        entity: model.getData(),
        node
      }
    };
  } catch (err) {
    logTrace.add('error', 'Find person by id fail', err);
    this.body = {
      success: false,
      message: err.message || 'Find person by id fail'
    };
  }
}

router.get('/root', findRootHandler);
router.get('/byId', util.requireIdMdw, findByIdHandler);

module.exports = router;
