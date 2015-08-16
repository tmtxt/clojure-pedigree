// Modules
var Util = require('./util.js');
var Nodes = require('./nodes.js');
var Links = require('./links.js');

////////////////////////////////////////////////////////////////////////////////
// Main function for rendering
function render(page) {
  var config = page.config;
  var root = page.root;
  var treeWidth = config.getTreeWidth();

  root.x0 = treeWidth / 2;
	root.y0 = 0;

  if(root.children) {
    root.children.forEach(Util.toggleAll);
  }

  update(page, root);

}
exports.render = render;

////////////////////////////////////////////////////////////////////////////////
// Functions for processing links list
function update(page, source) {
  var config = page.config;
  var duration = config.getTransitionDuration();
  var linkHeight = config.getLinkHeight();
  var treeLayout = page.treeLayout;
  var treeData = page.root;
  var nodesList = calculateNodesList(page);

  // Update nodes
  Nodes.updateNodes(page, source, nodesList);

  // Update links
  Links.updateLinks(page, source, nodesList);

  // compute the new tree height

  Util.updateTreeDiagramHeight(page);

  // Stash the old positions for transition.
  nodesList.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}
exports.update = update;

////////////////////////////////////////////////////////////////////////////////
// Function for calculating nodes list position using d3 api
function calculateNodesList(page) {
  var config = page.config;
  var linkHeight = config.getLinkHeight();
  var treeData = page.root;
  var treeLayout = page.treeLayout;
  var nodesList;

  nodesList = treeLayout.nodes(treeData).reverse();
  nodesList.forEach(function(d){
    d.y = d.depth * linkHeight;
    d.y += 80;
  });

  return nodesList;
}
