'use strict';

const util = require('util.js');

/**
 * Get person detail from person id
 * @param {string|int} personId
 * @param {object} opts
 * @returns {object}
 */
exports.getPerson = async function (personId, opts) {
  opts = opts || {};
  return await util.getData('/api/person/detail', {personId, readable: opts.readable});
};
