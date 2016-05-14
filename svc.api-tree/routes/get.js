'use strict';

const router = require('koa-router')();

const TreeController = require('../controllers/tree.js');

// Koa handler function
function* getHandler() {
  const logTrace = this.logTrace;
  const body = this.request.body;
  const personId = body.personId;
  const depth = body.depth;

  const tree = yield TreeController.getTree(personId, depth, logTrace);

  this.body = {
    success: true,
    data: tree
  };
}

router.get('/tree', getHandler);

module.exports = router;
