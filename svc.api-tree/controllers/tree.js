'use strict';

const svcTree = require('pd.services').tree;

const PersonController = require('./person.js');

/**
 * Construct tree data
 * @param {int} personId
 * @param {int} depth
 * @param {LogTrace} logTrace
 *
 * @return {object}
 */
function* getTree(personId, depth, logTrace) {
  const root = yield PersonController.findRoot(personId, logTrace);

  // The tree structure that neo4j query returns
  // const neoTree = yield svcTree.getTree(personId, depth, logTrace);

  return root;
}

module.exports = {
  getTree
};
