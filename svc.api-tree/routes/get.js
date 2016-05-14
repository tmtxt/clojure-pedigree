'use strict';

const router = require('koa-router')();
const svcTree = require('pd.services').tree;

// Koa handler function
function* getHandler() {
  const logTrace = this.logTrace;

  const tree = yield svcTree.getTree(2, 5, logTrace);

  this.body = {
    tree
  };
}

router.get('/tree', getHandler);

module.exports = router;
