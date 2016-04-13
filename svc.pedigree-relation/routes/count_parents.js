'use strict';

const router = require('koa-router')();
const util = require('./util.js');

// Koa handler function
function* countHandler() {
  const logTrace = this.logTrace;
  const pedigreeRelation = this.neo.pedigreeRelation;
  const body = this.request.body;
  const personNodeId = body.personNodeId;

  try {
    const count = yield pedigreeRelation.countParents(personNodeId);

    logTrace.add('info', 'pedigreeRelation.countParents()', 'Success');
    this.body = {
      success: true,
      message: `This node has ${count} parents`,
      data: count
    };
  } catch (err) {
    logTrace.add('error', 'pedigreeRelation.countParents()', err);
    this.body = {
      success: false,
      message: err
    };
    return;
  }
}

router.get('/parents', util.requirePersonNodeIdMdw, countHandler);

module.exports = router;
