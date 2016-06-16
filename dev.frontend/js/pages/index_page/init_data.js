'use strict';

const api = require('API');
const apiMinorContent = api.minorContent;


exports.createInitData = async function(tree) {
  const [preface, treeDesc] = await Promise.all([
    apiMinorContent.getPreface(),
    apiMinorContent.getTreeDesc()
  ]);

  tree.set('preface', preface);
  tree.set('treeDesc', treeDesc);
  tree.set('initializing', false);
};
