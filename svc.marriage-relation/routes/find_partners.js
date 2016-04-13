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
function* findHandler() {
  const logTrace = this.logTrace;
  const marriageRelation = this.neo.marriageRelation;
  const body = this.request.body;
  const personNodeId = body.personNodeId;

  try {
    const nodes = yield marriageRelation.findPartners(personNodeId);

    logTrace.add('info', 'marriageRelation.findPartners()', 'Success');
    this.body = {
      success: true,
      message: `Found ${nodes.length} partners for node with id ${personNodeId}`,
      data: nodes
    };
  } catch (err) {
    logTrace.add('error', 'marriageRelation.findPartners()', err);
    this.body = {
      success: false,
      message: err
    };
    return;
  }
}

router.get('/partners', validateMdw, findHandler);

module.exports = router;
