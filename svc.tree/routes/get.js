'use strict';

const router = require('koa-router')();

// Koa handler function
function* getHandler() {
  const logTrace = this.logTrace;
  const body = this.request.body;
  const rootId = body.rootNodeId;
  const depth = body.depth || 5;
  const tree = this.neo.tree;

  const result = yield tree.getTree(rootId, depth);

  this.body = {
    success: true,
    data: result
  };
}

router.get('/tree', getHandler);

module.exports = router;
