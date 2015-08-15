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
  var root = page.root;
  var treeWidth = config.getTreeWidth();

  root.x0 = treeWidth / 2;
	root.y0 = 0;

  if(root.children) {
    root.children.forEach(toggleAll);
  }

  // console.log(root);
  update(page, root);
}
exports.render = render;

var i = 0;
function update(page, source) {
  var config = page.config;
  var duration = config.getTransitionDuration();
  var linkHeight = config.getLinkHeight();

  page.nodesList = page.treeLayout.nodes(page.root).reverse();
  page.nodesList.forEach(function(d) { d.y = d.depth * linkHeight; });
  page.nodesList.forEach(function(d) {
    // move the diagram down 80px
    d.y += 80;
	});

  // select the groups of node, each group represent a person, bind the data
  // from page.root to those groups
  var nodeGroups = page.rootGroup.selectAll("g.node")
      .data(page.nodesList, function(d) { return d.id || (d.id = ++i); });

  // ENTER
  // create new node group if not exist
  var nodeEnter = nodeGroups.enter().append("svg:g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.x0 + "," + source.y0 + ")"; });
  // create the elements inside that node group
  nodeEnter.append("svg:circle")
		.on("click", function(d) {
      toggle(d); // toggle the node
      update(page, d); // render the children
    });
  nodeEnter.append("svg:text");
  nodeEnter.append("svg:image")
    .attr("xlink:href", function(d){
      return d["user-id"];
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
  // update the node circle and text
  nodeUpdate.select("circle")
    .attr("r", 10)
    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
  nodeUpdate.select("text")
    .text(function(d) { return d["user-id"]; })
    .attr("y", -19)
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .style("fill-opacity", 1);

  // EXIT
  // Transition exiting nodes to the parent's new position.
  var nodeExit = nodeGroups.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.x + "," + source.y + ")"; })
      .remove();

  // Update the links
  var links = page.rootGroup.selectAll("path.link")
      .data(page.treeLayout.links(page.nodesList), function(d) { return d.target.id; });
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
  page.nodesList.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}
