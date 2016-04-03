'use strict';

const router = require('koa-router')();
const util = require('./util.js');

function* findNode(ctx, logTrace) {
  var personId = ctx.request.body.personId;
  var neoPerson = ctx.neo.person;

  logTrace.add('info', `Finding neo4j node with person id ${personId}`);
  var node = yield neoPerson.find(personId);
  return node;
}

function* deleteHandler() {
  var logTrace = this.logTrace;

  try {
    var node = yield findNode(this, logTrace);
    this.body = {
      success: true,
      data: node
    };
  } catch (err) {
    this.body = {
      success: false
    };
  }
}

router.post('/', util.requireIdMdw, deleteHandler);

module.exports = router;
