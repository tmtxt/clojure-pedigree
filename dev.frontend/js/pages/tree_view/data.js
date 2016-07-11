const api = require('API');
const apiTree = api.tree;

exports.getData = async function(tree) {
  const pedigreeTree = await apiTree.getTreeData();

  tree.set('pedigreeTree', pedigreeTree);
  tree.set('initializing', false);
};
