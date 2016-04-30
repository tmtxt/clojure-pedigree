'use strict';

const router = require('koa-router')();
const _ = require('lodash');

// Middleware for validating data
function* validateMdw(next) {
  const logTrace = this.logTrace;
  const body = this.request.body;
  const fatherNodeId = body.fatherNodeId;
  const motherNodeId = body.motherNodeId;
  const childNodeId = body.childNodeId;

  if (_.isNil(fatherNodeId) || _.isNil(motherNodeId) || _.isNil(childNodeId)) {
    let message = 'fatherNodeId, motherNodeId and childNodeId are required';
    logTrace.add('error', 'Validate fatherNodeId, motherNodeId and childNodeId', message);
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
  const fatherNodeId = body.fatherNodeId;
  const motherNodeId = body.motherNodeId;
  const childNodeId = body.childNodeId;
  const fatherChildOrder = body.fatherChildOrder;
  const motherChildOrder = body.motherChildOrder;

  try {
    const rel = yield pedigreeRelation.addChildForParent(
      fatherNodeId, motherNodeId, childNodeId, fatherChildOrder, motherChildOrder
    );

    logTrace.add('info', 'pedigreeRelation.addChildForParent()', 'Success');
    this.body = {
      success: true,
      message: 'Father and mother child relation created',
      data: rel
    };
  } catch (err) {
    logTrace.add('error', 'pedigreeRelation.addChildForParent()', err);
    this.body = {
      success: false,
      message: err
    };
    return;
  }
}

router.post('/fromBoth', validateMdw, addHandler);

module.exports = router;
