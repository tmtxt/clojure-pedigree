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


function disableAllMarriages(d) {
  if (d.children) {
    d.children.forEach(disableAllMarriages);
  }
  d._marriage = d.marriage;
  d.marriage = null;
}


exports.getData = async function(tree) {
  const pedigreeTree = await apiTree.getTreeData();
  if (pedigreeTree.children) {
    pedigreeTree.children.forEach(toggleAll);
  }
  disableAllMarriages(pedigreeTree);

  tree.set('pedigreeTree', pedigreeTree);
  tree.set('initializing', false);
};
