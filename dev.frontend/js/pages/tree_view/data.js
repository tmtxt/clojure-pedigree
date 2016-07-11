const api = require('API');
const apiTree = api.tree;

exports.getData = async function(tree) {
  const treeData = await apiTree.getTreeData();
  console.log(treeData);
};
