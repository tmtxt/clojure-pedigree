'use strict';

const _ = require('lodash');

const svcPerson = require('pd.services').person;
const svcMarriageRelation = require('pd.services').marriageRelation;


/**
 * Find all partner entities of this person node id
 * @param {int} personNodeId
 * @param {LogTrace} logTrace
 * @returns {array}
 */
function* findMarriageEntities(personNodeId, logTrace) {
  // find marriage nodes
  logTrace.add('info', 'findMarriageEntities()', 'Find all partner nodes');
  const nodes = yield svcMarriageRelation.findPartnerNodes(personNodeId, logTrace);

  // get the marriage person ids
  const marriagePersonIds = _.map(nodes, (node) => node.partnerId);

  // find all the marriage person
  logTrace.add('info', 'findMarriageEntities()', 'Find all persons by ids');
  const partners = yield svcPerson.findByIds(marriagePersonIds, logTrace);

  // filter the key
  const result = _.map(partners, function(partner){
    return partner.entity;
  });

  return result;
}


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

  const rootNode = root.node;
  const rootInfo = root.entity;
  const rootMarriages = yield findMarriageEntities(rootNode.id, logTrace);

  return {
    node: rootNode,
    info: rootInfo,
    marriage: rootMarriages
  };
}


module.exports = {
  findRoot
};
