'use strict';

const $ = require('jquery');
const util = require('util.js');

exports.getData = async function(tree) {
  const params = tree.get('params');
  const personId = params.personId;

  const personInfo = await util.getData('/api/person/detail', {personId});
  tree.set('personInfo', personInfo);
};
