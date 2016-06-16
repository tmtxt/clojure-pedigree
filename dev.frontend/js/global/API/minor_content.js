'use strict';

const util = require('util.js');

/**
 * Get preface content
 * @returns {object}
 */
exports.getPreface = async function () {
  return await util.getData('/api/minorContent/preface', {});
};


/**
 * Get preface content
 * @returns {object}
 */
exports.getTreeDesc = async function () {
  return await util.getData('/api/minorContent/treeDesc', {});
};
