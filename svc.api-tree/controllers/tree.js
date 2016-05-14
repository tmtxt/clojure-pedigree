'use strict';

const _ = require('lodash');

const svcTree = require('pd.services').tree;

const PersonController = require('./person.js');


/**
 * Extract list of ids as object from the rows returned from
 * The input rows look like this
 * [
 *   { "marriage": [8], "path": [4, 5] },
 *   { "marriage": [10], "path": [4, 9] },
 *   { "marriage": [], "path": [4, 5, 11] }
 * ]
 * The resule would look like this
 * [ 8, 5, 10, 9, 11 ]
 * @param {array} rows
 * @returns {object}
 */
function extractIds(rows) {
  let ids = _.reduce(rows, function(ids, row){
    _.each(row.marriage, function(marriageId){
      ids.push(marriageId);
    });
    ids.push(_.last(row.path));
    return ids;
  }, []);

  return _.compact(ids);
}


/**
 * Construct tree data
 * @param {int} personId
 * @param {int} depth
 * @param {LogTrace} logTrace
 *
 * @return {object}
 */
function* getTree(personId, depth, logTrace) {
  // find root person with marriage information
  const root = yield PersonController.findRoot(personId, logTrace);

  // The tree structure that neo4j query returns
  const neoTree = yield svcTree.getTree(root.node.id, depth, logTrace);
  const ids = extractIds(neoTree);
  const personsByIds = yield PersonController.findEntitiesByIds(ids, {returnObject: true}, logTrace);

  return personsByIds;
}

module.exports = {
  getTree
};
