'use strict';

const api = require('API');
const apiPerson = api.person;
const apiPedigree = api.pedigree;
const apiMarriage = api.marriage;
const ErrorModal = require('ErrorModal');

const pageUtil = require('./util.js');

exports.createInitData = async function(tree) {
  // get the from person information
  const fromRole = tree.get('fromRole');
  const fromPersonId = tree.get(['params', 'personId']);
  const fromPerson = await apiPerson.getPerson(fromPersonId);
  tree.set('fromPerson', fromPerson);

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

  // set data for add from partner
  if (fromRole == 'partner') {
    const partnerRole = await apiMarriage.detectPartnerRole(fromPerson.gender);
    tree.set('partnerRole', partnerRole.role);
    tree.set('partner', fromPerson);
  }

  // set data for add from child
  if (fromRole == 'child') {
    const {count} = await apiPedigree.countParents(fromPersonId);
    if (count == 2) {
      ErrorModal.showErrorModal({
        message: 'Thành viên này đã có đầy đủ cha mẹ',
        redirect: '/'
      });
      return;
    }
    tree.set('child', fromPerson);
  }

  // finish init
  tree.set('initializing', false);
};
