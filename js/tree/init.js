// Init
var q = require('q');
var d3 = require('d3');

// General init function
// Returns a promise, resolve when finish initializing
function init(page) {
  return q.Promise(function(resolve){
    initLayout(page);           // Init the d3 tree layout
    initSvg(page);              // Init the root svg tag for holding other
                                // elements
    resolve();                  // Finish the promise
  });
}
exports.init = init;

// Init the d3 tree layout
function initLayout(page) {
  var config = page.config;
  var treeWidth = config.getTreeWidth();
  var treeHeight = config.getTreeHeight();

  page.treeLayout = d3.layout.tree().size([treeWidth, treeHeight]);
  page.diagonal = d3.svg.diagonal().projection(function(d) { return [d.x, d.y]; });
}

// init the SVG elements
function initSvg(page) {
  var config = page.config;
  var containerId = config.getContainerId();
  var treeWidth = config.getTreeWidth();
  var treeHeight = config.getTreeHeight();

  // SVG root, for holding all the tree elements
  page.rootSvg = d3.select(containerId).append("svg:svg")
    .attr("width", treeWidth)
    .attr("height", treeHeight);

  // Svg root group
  page.rootGroup = page.rootSvg.append("svg:g")
    .attr("transform", "translate(" + 0 + "," + 0 + ")");
}
