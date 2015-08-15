// Toggle show hide
function toggleAll(d) {
  if (d.children) {
    d.children.forEach(toggleAll);
    toggle(d);
  }
}

function toggle(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
}

function render(page) {
  var config = page.config;
  var root = page.treeData;
  var treeWidth = config.getTreeWidth();

  root.x0 = page.treeWidth / 2;
	root.y0 = 0;

  if(root.children) {
    root.children.forEach(toggleAll);
  }

  console.log(root);
}
exports.render = render;
