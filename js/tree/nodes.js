// Modules
var Render = require('./render.js');
var Util = require('./util.js');

var id = 0;

// Functions for processing the tree nodes
function updateNodes(page, source) {
  var config = page.config;
  var duration = config.getTransitionDuration();
  var linkHeight = config.getLinkHeight();
  var treeLayout = page.treeLayout;
  var treeData = page.root;

  // Calculate Node list position
  var nodesList = calculateNodesList(page);

  // Bind data to the svg nodes (not actual nodes now)
  var nodeGroups = page.rootGroup.selectAll("g.node")
      .data(nodesList, function(d) { return d.id || (d.id = ++id); });

  // ENTER
  // Now actually create new node group if not exist
  var nodeEnter = nodeGroups.enter().append("svg:g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.x0 + "," + source.y0 + ")"; });
  // Create the elements inside that node group
  // The circle to click for expanding
  nodeEnter.append("svg:circle")
		.on("click", function(d) {
      Util.toggle(d);
      Render.update(page, d); // Update the tree again
    });
  // Person name
  nodeEnter.append("svg:text")
    .text(function(d) { return d.info.full_name; })
    .attr("y", -19)
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .style("fill-opacity", 1);
  // Person image
  nodeEnter.append("svg:image")
    .attr("xlink:href", function(d){
      return d.info.picture;
    })
    .attr("x", -20)
    .attr("y", -68)
    .attr("height", "40px")
    .attr("width", "40px")
    .on('click', function(d){
      // Util.showInfoModal(d.id);
    });
  // NodeMarriage.appendMarriage(page, nodeEnter);

	// UPDATE
  // Update the data and transition nodes to their new position.
  var nodeUpdate = nodeGroups.transition()
      .duration(duration)
      .attr("transform", function(d) {
			  return "translate(" + d.x + "," + d.y + ")";
      });
  nodeUpdate.select("circle")
    .attr("r", 10)
    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  // EXIT
  // Transition exiting nodes to the parent's new position.
  var nodeExit = nodeGroups.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.x + "," + source.y + ")"; })
      .remove();

  return nodesList;
}
exports.updateNodes = updateNodes;

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
