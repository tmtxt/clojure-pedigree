'use strict';

const router = require('koa-router')();

// Middleware for validating data
function* validateMdw(next) {
  const logTrace = this.logTrace;
  const body = this.request.body;
  const motherNodeId = body.motherNodeId;
  const childNodeId = body.childNodeId;

  if (!motherNodeId || !childNodeId) {
    let message = 'Mother node id and child node id are required';
    logTrace.add('error', 'Validate mother node id and child node id', message);
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
  const motherNodeId = body.motherNodeId;
  const childNodeId = body.childNodeId;
  const childOrder = body.childOrder;

  try {
    const rel = yield pedigreeRelation.addChildForMother(
      motherNodeId, childNodeId, childOrder
    );

    logTrace.add('info', 'pedigreeRelation.addChildForMother()', 'Success');
    this.body = {
      success: true,
      message: 'Mother child relation created',
      data: rel
    };
  } catch (err) {
    logTrace.add('error', 'pedigreeRelation.addChildForMother()', err);
    this.body = {
      success: false,
      message: err
    };
    return;
  }
}

router.post('/fromMother', validateMdw, addHandler);

module.exports = router;
