'use strict';

const util = require('util.js');


/**
 * Get tree data
 * @param {int} rootId
 * @param {int} depth
 * @returns {object} the tree object
 */
exports.getTreeData = async function(rootId, depth) {
  return await util.getData('/api/tree/data', {rootId, depth});
};
