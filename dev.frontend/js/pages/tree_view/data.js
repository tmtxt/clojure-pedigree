const api = require('API');
const apiTree = api.tree;


function toggle(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
}


function toggleAll(d) {
  if (d.children) {
    d.children.forEach(toggleAll);
    toggle(d)
  }
}


exports.getData = async function(tree) {
  const pedigreeTree = await apiTree.getTreeData();
  if (pedigreeTree.children) {
    pedigreeTree.children.forEach(toggleAll);
  }

  tree.set('pedigreeTree', pedigreeTree);
  tree.set('initializing', false);
};
