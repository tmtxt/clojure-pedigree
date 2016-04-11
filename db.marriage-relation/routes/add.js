'use strict';

const router = require('koa-router')();

// Middleware for validating data
function* validateMdw(next) {
  const logTrace = this.logTrace;
  const body = this.request.body;
  const husbandNodeId = body.husbandNodeId;
  const wifeNodeId = body.wifeNodeId;

  if (!husbandNodeId || !wifeNodeId) {
    let message = 'husbandNodeId and wifeNodeId are required';
    logTrace.add('error', 'Validate husbandNodeId and wifeNodeId', message);
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
  const marriageRelation = this.neo.marriageRelation;
  const body = this.request.body;
  const husbandNodeId = body.husbandNodeId;
  const wifeNodeId = body.wifeNodeId;
  const husbandWifeOrder = body.husbandWifeOrder;
  const wifeHusbandOrder = body.wifeHusbandOrder;

  try {
    const rels = yield marriageRelation.addMarriage(
      husbandNodeId, wifeNodeId, husbandWifeOrder, wifeHusbandOrder
    );

    logTrace.add('info', 'marriageRelation.addMarriage()', 'Success');
    this.body = {
      success: true,
      message: 'Marriage relation created',
      data: rels
    };
  } catch (err) {
    logTrace.add('error', 'marriageRelation.addMarriage()', err);
    this.body = {
      success: false,
      message: err
    };
    return;
  }
}

router.post('/', validateMdw, addHandler);

module.exports = router;
