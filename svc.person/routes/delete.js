'use strict';

const router = require('koa-router')();
const util = require('./util.js');

// Find neo4j person node
function* findNode(ctx) {
  var logTrace = ctx.logTrace;
  var personId = ctx.request.body.personId;
  var neoPerson = ctx.neo.person;

  logTrace.add('info', `Finding neo4j node with person id ${personId}`);
  var node = yield neoPerson.find(personId);

  if (!node) {
    throw `Cannot find person node with person id ${personId}`;
  }

  return node;
}

// Find pg model
function* findModel(ctx) {
  var logTrace = ctx.logTrace;
  var personId = ctx.request.body.personId;
  var Person = ctx.pg.Person;

  logTrace.add('info', `Finding pg model with person id ${personId}`);
  const model = yield Person.findOne({
    where: {
      id: personId
    }
  });

  if (!model) {
    throw `Cannot find person model with person id ${personId}`;
  }

  return model;
}

// Delete neo4j node
function* deleteNode(node, ctx) {
  var logTrace = ctx.logTrace;
  var neoPerson = ctx.neo.person;

  logTrace.add('info', 'Deleting neo4j node');
  yield neoPerson.delete(node);
}

// Delete pg model
function* deleteModel(model, ctx) {
  var logTrace = ctx.logTrace;

  logTrace.add('info', 'Deleting pg model');
  yield model.destroy();
}

function* deleteHandler() {
  const logTrace = this.logTrace;

  try {
    const model = yield findModel(this);
    const node = yield findNode(this);

    yield deleteNode(node, this);
    yield deleteModel(model, this);

    let message = 'Person model and node removed';
    logTrace.add('info', 'Delete person successfully', message);
    this.body = {
      success: true,
      message
    };
  } catch (err) {
    logTrace.add('error', 'Delete person fail', err);
    let message = err;
    this.body = {
      success: false,
      message
    };
  }
}

router.post('/', util.requireIdMdw, deleteHandler);

module.exports = router;
