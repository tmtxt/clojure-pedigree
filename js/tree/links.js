function updateLinks(page, source, nodesList) {
  var config = page.config;
  var duration = config.getTransitionDuration();

  // Bind data to the links (not actually create the elements)
  var linksGroup = page.rootGroup.selectAll("path.link")
      .data(page.treeLayout.links(nodesList), function(d) { return d.target.id; });

  enter(page, source, linksGroup);
  update(page, source, linksGroup);
  exit(page, source, linksGroup);

}
exports.updateLinks = updateLinks;

function enter(page, source, linksGroup) {
  var config = page.config;
  var duration = config.getTransitionDuration();

  // create missing links if necessary
  linksGroup.enter().insert("svg:path", "g")
    .attr("class", "link")
    .attr("d", function(d) {
      var o = {x: source.x0, y: source.y0};
      return page.diagonal({source: o, target: o});
    })
    .transition()
    .duration(duration)
    .attr("d", page.diagonal);
}

function update(page, source, linksGroup) {
  var config = page.config;
  var duration = config.getTransitionDuration();

  // transition links
  linksGroup.transition()
    .duration(duration)
    .attr("d", page.diagonal);
}

function exit(page, source, linksGroup) {
  var config = page.config;
  var duration = config.getTransitionDuration();

  // remove un-used links
  linksGroup.exit().transition()
    .duration(duration)
    .attr("d", function(d) {
      var o = {x: source.x, y: source.y};
      return page.diagonal({source: o, target: o});
    })
    .remove();
}
