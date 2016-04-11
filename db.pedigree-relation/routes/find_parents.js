'use strict';

const router = require('koa-router')();
const util = require('./util.js');

// Koa handler function
function* findHandler() {
  const logTrace = this.logTrace;
  const pedigreeRelation = this.neo.pedigreeRelation;
  const body = this.request.body;
  const personNodeId = body.personNodeId;

  try {
    const parentNodes = yield pedigreeRelation.findParents(personNodeId);

    logTrace.add('info', 'pedigreeRelation.findParents()', 'Success');
    this.body = {
      success: true,
      data: parentNodes
    };
  } catch (err) {
    logTrace.add('error', 'pedigreeRelation.findParents()', err);
    this.body = {
      success: false,
      message: err
    };
    return;
  }
}

router.get('/parents', util.requirePersonNodeIdMdw, findHandler);

module.exports = router;
