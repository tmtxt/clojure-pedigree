'use strict';

const api = require('API');
const apiMinorContent = api.minorContent;


exports.createInitData = async function(tree) {
  const preface = await apiMinorContent.getPreface();

  tree.set('preface', preface);
  tree.set('initializing', false);
};
