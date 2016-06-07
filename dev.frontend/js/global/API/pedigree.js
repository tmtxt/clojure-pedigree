'use strict';

const util = require('util.js');

/**
 * Get parent information from the person id
 * @param {string|int} personId
 * @returns {object}
 */
exports.getParents = async function(personId) {
  return await util.getData('/api/pedigree/getParents', {personId});
}
