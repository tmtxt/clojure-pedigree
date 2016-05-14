'use strict';

const send = require('./util.js').send;


function* getTree(rootNodeId, depth, logTrace) {
  const body = {rootNodeId, depth};
  const tree = yield send('tree', '/get/tree', 'get', body, logTrace);

  return tree;
}

module.exports = {
  getTree
};
