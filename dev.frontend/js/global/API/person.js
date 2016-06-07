'use strict';

const util = require('util.js');

/**
 * Get person detail from person id
 * @param {string|int} personId
 * @returns {object}
 */
exports.getPerson = async function (personId) {
  return await util.getData('/api/person/detail', {personId});
};
