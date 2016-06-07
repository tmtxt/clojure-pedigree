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


/**
 * Detect the parent role (father/mother) from the gender
 * @param {string} gender
 * @returns {string}
 */
exports.detectParentRole = async function(gender) {
  return await util.getData('/api/pedigree/detect/parentRole', {gender});
}
