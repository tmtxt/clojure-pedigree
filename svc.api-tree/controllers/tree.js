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
  root.children = [];

  // The tree structure that neo4j query returns
  const neoTree = yield svcTree.getTree(root.node.id, depth, logTrace);
  const ids = extractIds(neoTree);
  const personsByIds = yield PersonController.findEntitiesByIds(ids, {returnObject: true}, logTrace);

  // each row in "rows" contain the path (person id to that person
  // loop through each row, for each row, walk the the path and append to the "children" array prop
  // of its parent
  // note: all the rows are sorted by depth order, so this is okay to skip for check "children"
  // array null
  const rows = neoTree;
  const tree = root;

  for(let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const path = ['children'];

    for(let j = 1; j < row.path.length; j++) {
      const currentId = row.path[j];
      const continueLoop = j < row.path.length - 1;
      const children = _.get(tree, path);
      if (continueLoop) {
        // find the person in the child array
        const idx = _.findIndex(children, {id: currentId});
        path.push(idx);
        path.push('children');
      } else {
        // last id in the path, create the person
        const person = _.cloneDeep(personsByIds[currentId]);
        person.children = [];
        // append the marriage info
        const marriage = _.map(row.marriage, function(personId){
          const person = _.cloneDeep(personsByIds[personId]);
          return person;
        });
        person.marriage = marriage;
        // add to its parent's children array
        children.push(person);
      }
    }
  }

  return tree;
}

module.exports = {
  getTree
};
