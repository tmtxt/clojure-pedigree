'use strict';

const util = require('util.js');


/**
 * Get the current user information and write to the baobab tree
 * @param {Baobab} tree
 */
exports.getData = async function(tree) {
  const user = await util.getData('/api/auth/user', {});
  tree.set('user', user);
};
