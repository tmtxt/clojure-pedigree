'use strict';

const api = require('API');
const apiPerson = api.person;
const apiPedigree = api.pedigree;
const apiMarriage = api.marriage;

async function getPerson(personId, tree) {
  const person = await apiPerson.getPerson(personId, {readable: true});
  tree.set('person', person);
  return person;
}

async function getParents(personId, tree) {
  const parents = await apiPedigree.getParents(personId);
  tree.set('parents', parents);
  return parents;
}

async function getPartners(personId, tree) {
  const partners = await apiMarriage.getPartners(personId);
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
