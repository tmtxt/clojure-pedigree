'use strict';

const util = require('util.js');


/**
 * Get partners list of this person id
 * @param {string|int} personId
 * @returns {array}
 */
exports.getPartners = async function(personId) {
  return await util.getData('/api/marriage/getPartners', {personId});
};
