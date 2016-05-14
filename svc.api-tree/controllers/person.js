'use strict';

const svcPerson = require('pd.services').person;


/**
 * Find root tree information (including node, entity and marriage information
 * If personId exist, find root from that person
 * Otherwise, find the first root
 * @param {int} personId
 * @param {LogTrace} logTrace
 * @return {object}
 */
function* findRoot(personId, logTrace) {
  // find root person first
  let root;
  if (personId) {
    logTrace.add('info', 'findRoot()', 'personId exist, find using personId');
    root = yield svcPerson.findById(personId, logTrace);
  }

  if (!root) {
    logTrace.add('info', 'findRoot()', 'Find the first root in the system');
    root = yield svcPerson.findRoot(logTrace);
  }

  if (!root) {
    logTrace.add('error', 'findRoot()', 'Cannot find root');
    throw new Error('Cannot find root');
  }

  return root;
}


module.exports = {
  findRoot
};
