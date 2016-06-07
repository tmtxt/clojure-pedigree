'use strict';

const api = require('API');
const apiPerson = api.person;
const apiPedigree = api.pedigree;

const pageUtil = require('./util.js');

exports.createInitData = async function(tree) {
  // get the from person information
  const fromRole = tree.get('fromRole');
  const fromPersonId = tree.get(['params', 'personId']);
  const fromPerson = await apiPerson.getPerson(fromPersonId);

  // set the data for add from parent
  if (fromRole == 'parent') {
    const parentRole = await apiPedigree.detectParentRole(fromPerson.gender);
    if (parentRole.role == 'mother') {
      tree.set('parentRole', 'mother');
      tree.set('mother', fromPerson);
      tree.set('father', pageUtil.createEmptyPerson());
    } else {
      tree.set('parentRole', 'father');
      tree.set('father', fromPerson);
      tree.set('mother', pageUtil.createEmptyPerson());
    }
  }

  // finish init
  tree.set('initializing', false);
};
