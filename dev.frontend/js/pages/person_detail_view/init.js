'use strict';

const util = require('util.js');

async function getPerson(personId, tree) {
  const person = await util.getData('/api/person/detail', {personId});
  tree.set('person', person);
  return person;
}

async function getParents(personId, tree) {
  const parents = await util.getData('/api/pedigree/getParents', {personId});
  tree.set('parents', parents);
  return parents;
}

async function getPartners(personId, tree) {
  const partners = await util.getData('/api/marriage/getPartners', {personId});
  tree.set('partners', partners);
  return partners;
}

exports.getData = async function(tree) {
  const params = tree.get('params');
  const personId = params.personId;

  const result = await Promise.all([
    getPerson(personId, tree),
    getParents(personId, tree),
    getPartners(personId, tree)
  ]);

  const [person] = result;
  document.title = person.fullName;
};
