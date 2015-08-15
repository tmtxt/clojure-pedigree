////////////////////////////////////////////////////////////////////////////////
// Toggle children
function toggleAll(d) {
  if (d.children) {
    d.children.forEach(toggleAll);
    toggle(d);
  }
}
exports.toggleAll = toggleAll;

function toggle(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
}
exports.toggle = toggle;
