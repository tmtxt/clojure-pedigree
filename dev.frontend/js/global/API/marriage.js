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


/**
 * Detect the partner role (husband/wife) from the gender
 * @param {string} gender
 * @returns {string}
 */
exports.detectPartnerRole = async function(gender) {
  return await util.getData('/api/marriage/detect/partnerRole', {gender});
}
