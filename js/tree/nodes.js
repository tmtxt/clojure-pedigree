// Modules
var Render = require('./render.js');
var Util = require('./util.js');

// Variables
var id = 0;

////////////////////////////////////////////////////////////////////////////////
// Functions for processing the tree nodes
function updateNodes(page, source, nodesList) {
  var treeLayout = page.treeLayout;
  var treeData = page.root;

  // Bind data to the svg nodes (not actual nodes now)
  var nodeGroups = page.rootGroup.selectAll("g.node")
      .data(nodesList, function(d) { return d.id || (d.id = ++id); });

  enter(page, source, nodeGroups);
  update(page, source, nodeGroups);
  exit(page, source, nodeGroups);
}
exports.updateNodes = updateNodes;

////////////////////////////////////////////////////////////////////////////////
// Enter
function enter(page, source, nodeGroups) {
  // Now actually create new node group if not exist
  var nodeEnter = nodeGroups.enter().append("svg:g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.x0 + "," + source.y0 + ")"; });
  // Create the elements inside that node group
  appendCircles(page, nodeEnter);
  appendNames(page, nodeEnter);
  appendImages(page, nodeEnter);

  // NodeMarriage.appendMarriage(page, nodeEnter);
}

function appendCircles(page, nodeEnter) {
  // The circle to click for expanding
  nodeEnter.append("svg:circle")
		.on("click", function(d) {
      Util.toggle(d);
      Render.update(page, d); // Update the tree again
    });
}

function appendNames(page, nodeEnter) {
  // Person name
  nodeEnter.append("svg:text")
    .text(function(d) { return d.info.full_name; })
    .attr("y", -19)
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .style("fill-opacity", 1);
}

function appendImages(page, nodeEnter) {
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
}

////////////////////////////////////////////////////////////////////////////////
// Update
function update(page, source, nodeGroups) {
  var config = page.config;
  var duration = config.getTransitionDuration();

  // Update the data and transition nodes to their new position.
  var nodeUpdate = nodeGroups.transition()
      .duration(duration)
      .attr("transform", function(d) {
			  return "translate(" + d.x + "," + d.y + ")";
      });
  nodeUpdate.select("circle")
    .attr("r", 10)
    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
}

////////////////////////////////////////////////////////////////////////////////
// Exit
function exit(page, source, nodeGroups) {
  var config = page.config;
  var duration = config.getTransitionDuration();

  // Transition exiting nodes to the parent's new position.
  var nodeExit = nodeGroups.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.x + "," + source.y + ")"; })
      .remove();
}
