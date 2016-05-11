// Libs
var d3 = require('d3');
var jquery = require('jquery');

// Components
var treeContainer = jquery('#js-tree-container');

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

function findMaxDepth(root) {
  var currentMaxDepth = 0;
  findMaxDepthRecursive(root);

  function findMaxDepthRecursive(parent) {
    if(parent.children && parent.children.length > 0){
			parent.children.forEach(function(d){
				findMaxDepthRecursive(d);
			});
		} else if(parent.depth > currentMaxDepth){
			currentMaxDepth = parent.depth;
		}
  }

  return currentMaxDepth;
}

function updateTreeDiagramHeight(page) {
  // calculate new height
  var config = page.config;
  var linkHeight = config.getLinkHeight();
  var maxDepth = findMaxDepth(page.root);
	var newHeight = (maxDepth * linkHeight) + 100;
  var duration = config.getTransitionDuration() + 100;

  // update the display height
  var rootSvg = page.rootSvg;
  rootSvg.transition().duration(duration)
    .attr('height', newHeight);
  treeContainer.animate({
    height: newHeight
  }, duration);

  // add to the config
  config.setTreeHeight(newHeight);
}
exports.updateTreeDiagramHeight = updateTreeDiagramHeight;
