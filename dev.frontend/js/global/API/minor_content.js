'use strict';

const util = require('util.js');

/**
 * Get preface content
 * @returns {object}
 */
exports.getPreface = async function () {
  return await util.getData('/api/minor-content/preface', {});
};
