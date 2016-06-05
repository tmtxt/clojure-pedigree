'use strict';

const util = require('util.js');

exports.getData = async function(tree) {
  const params = tree.get('params');
  const personId = params.personId;

  const result = await util.getData('/api/person/detail', {personId});
  const {person, parents, partners} = result;

  tree.set('person', person);
  tree.set('parents', parents);
  tree.set('partners', partners);
};
