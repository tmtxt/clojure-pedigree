'use strict';

const router = require('koa-router')();
const _ = require('lodash');

// Middleware for validating data
function* validateMdw(next) {
  const logTrace = this.logTrace;
  const body = this.request.body;
  const fatherNodeId = body.fatherNodeId;
  const childNodeId = body.childNodeId;

  if (_.isNil(fatherNodeId) || _.isNil(childNodeId)) {
    let message = 'Father node id and child node id are required';
    logTrace.add('error', 'Validate father node id and child node id', message);
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
  const childNodeId = body.childNodeId;
  const childOrder = body.childOrder;

  try {
    const rel = yield pedigreeRelation.addChildForFather(
      fatherNodeId, childNodeId, childOrder
    );

    logTrace.add('info', 'pedigreeRelation.addChildForFather()', 'Success');
    this.body = {
      success: true,
      message: 'Father child relation created',
      data: rel
    };
  } catch (err) {
    logTrace.add('error', 'pedigreeRelation.addChildForFather()', err);
    this.body = {
      success: false,
      message: err
    };
    return;
  }
}

router.post('/fromFather', validateMdw, addHandler);

module.exports = router;
