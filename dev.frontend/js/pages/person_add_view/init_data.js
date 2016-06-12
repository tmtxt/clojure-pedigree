'use strict';

const api = require('API');
const apiPerson = api.person;
const apiPedigree = api.pedigree;
const apiMarriage = api.marriage;

const pageUtil = require('./util.js');

exports.createInitData = async function(tree) {
  // get the from person information
  const fromRole = tree.get('fromRole');
  const fromPersonId = tree.get(['params', 'personId']);
  const fromPerson = await apiPerson.getPerson(fromPersonId);

  // set the data for add from parent
  if (fromRole == 'parent') {
    const [parentRole, parentPartners] = await Promise.all([
      apiPedigree.detectParentRole(fromPerson.gender),
      apiMarriage.getPartners(fromPersonId)
    ]);
    if (parentRole.role == 'mother') {
      tree.set('parentRole', 'mother');
      tree.set('mother', fromPerson);
      tree.set('father', pageUtil.createEmptyPerson());
    } else {
      tree.set('parentRole', 'father');
      tree.set('father', fromPerson);
      tree.set('mother', pageUtil.createEmptyPerson());
    }
    tree.set('parentPartners', parentPartners || []);
  }

  if (fromRole == 'partner') {
    const [partner] = await Promise.all([
    ]);
  }

  // finish init
  tree.set('initializing', false);
};
