// Modules
var Util = require('./util.js');
var Nodes = require('./nodes.js');

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

  // console.log(root);
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

  var nodesList = Nodes.updateNodes(page, source);

  // Update the links
  var links = page.rootGroup.selectAll("path.link")
      .data(page.treeLayout.links(nodesList), function(d) { return d.target.id; });
  links.enter().insert("svg:path", "g")
    .attr("class", "link")
    .attr("d", function(d) {
      var o = {x: source.x0, y: source.y0};
      return page.diagonal({source: o, target: o});
    })
    .transition()
    .duration(duration)
    .attr("d", page.diagonal);
  links.transition()
    .duration(duration)
    .attr("d", page.diagonal);
  links.exit().transition()
    .duration(duration)
    .attr("d", function(d) {
      var o = {x: source.x, y: source.y};
      return page.diagonal({source: o, target: o});
    })
    .remove();

  // compute the new tree height
  // Util.updateTreeDiagramHeight(page);

  // Stash the old positions for transition.
  nodesList.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}
exports.update = update;
