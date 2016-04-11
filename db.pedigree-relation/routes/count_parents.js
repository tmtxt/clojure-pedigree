'use strict';

const router = require('koa-router')();

// Middleware for validating data
function* validateMdw(next) {
  const logTrace = this.logTrace;
  const body = this.request.body;
  const personNodeId = body.personNodeId;

  if (!personNodeId) {
    let message = 'personNodeId is required';
    logTrace.add('error', 'Validate personNodeId', message);
    this.body = {
      success: false,
      message
    };
    return;
  }

  yield next;
}

// Koa handler function
function* addHandler() {
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

router.get('/parents', validateMdw, addHandler);

module.exports = router;
