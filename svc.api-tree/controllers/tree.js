'use strict';

const svcTree = require('pd.services').tree;


/**
 * Construct tree data
 * @param {int} personId
 * @param {int} depth
 * @param {LogTrace} logTrace
 *
 * @return {object}
 */
function* getTree(personId, depth, logTrace) {
  // The tree structure that neo4j query returns
  const neoTree = yield svcTree.getTree(personId, depth, logTrace);

  return neoTree;
}

module.exports = {
  getTree
};
