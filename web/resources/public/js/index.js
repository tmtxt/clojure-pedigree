(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Tree = require('./tree/main.js');
Tree.startRender({
  showDetailModal: false,
  linkHeight: 150
});

},{"./tree/main.js":6}],2:[function(require,module,exports){
(function (global){
// Libs
var jquery = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var d3 = (typeof window !== "undefined" ? window['d3'] : typeof global !== "undefined" ? global['d3'] : null);

// Configuration
var config = {};

// Link height
config.linkHeight = 200;
config.getLinkHeight = function() {
  return this.linkHeight;
};
config.setLinkHeight = function(val) {
  this.linkHeight = val;
  return this;
};

// Tree container id
config.containerId = "#js-tree-container";
config.getContainerId = function() {
  return this.containerId;
};

// Enable marriage display
config.enableMarriage = false;
config.getEnableMarriage = function() {
  return this.enableMarriage;
};
config.setEnableMarriage = function(val) {
  this.enableMarriage = val;
  return this;
};

// Tree width
config.treeWidth = jquery(config.containerId).width();
config.getTreeWidth = function() {
  return this.treeWidth;
};
config.setTreeWidth = function(val) {
  this.treeWidth = val;
  return this;
};

// Tree height
config.treeHeight = 1000;
config.getTreeHeight = function() {
  return this.treeHeight;
};
config.setTreeHeight = function(val) {
  this.treeHeight = val;
  return this;
};

// Transition duration
config.getTransitionDuration = function() {
  return d3.event && d3.event.altKey ? 5000 : 500;
};

// Allow show modal on click
config.showDetailModal = true;
config.getShowDetailModal = function() {
  return this.showDetailModal;
};
config.setShowDetailModal = function(val) {
  this.showDetailModal = val;
  return this;
};

// Is authenticated?
config.isAuthenticated = function() {
  var isAuthenticated = window.isAuthenticated || false;
  return isAuthenticated;
};

// Root person id
config.personId = window.personId;
config.getPersonId = function() {
  return this.personId;
};

// Tree depth
config.treeDepth = window.treeDepth;
config.getTreeDepth = function() {
  return this.treeDepth;
};

module.exports = config;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],3:[function(require,module,exports){
(function (global){
// libs
var jquery = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var config = require('./config.js');

// elements
var updateDepthButton = jquery('.js-update-tree-depth');
var treeDepthInput = jquery('.js-tree-depth-input');

// init value for tree depth input
var treeDepth = config.getTreeDepth();
if (!!treeDepth) {
  treeDepthInput.val(treeDepth);
}

// on update depth
updateDepthButton.click(function(){
  var depth;
  depth = treeDepthInput.val();
  depth = parseInt(depth);

  var personId = config.getPersonId();

  if (!isNaN(depth)) {
    if (!!personId) {
      window.location.replace('/tree/view/person/' + personId + '/depth/' + depth);
    } else {
      window.location.replace('/tree/view/depth/' + depth);
    }
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./config.js":2}],4:[function(require,module,exports){
(function (global){
// Init
var q = (typeof window !== "undefined" ? window['Q'] : typeof global !== "undefined" ? global['Q'] : null);
var d3 = (typeof window !== "undefined" ? window['d3'] : typeof global !== "undefined" ? global['d3'] : null);

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
var Request = require('./request.js');
var Config = require('./config.js');
var Init = require('./init.js');
var Render = require('./render.js');
var Marriage = require('./marriage.js');
var Depth = require('./depth.js');

// Global page object
var page = {
  config: null,
  treeLayout: null,
  diagonal: null,
  rootSvg: null,
  treeData: null
};
page.config = Config;

// Options to Config
function setConfig(opts) {
  var config = page.config;

  // options
  opts = opts || {};

  // show detail modal
  var showDetailModal = opts.showDetailModal || false;
  config.setShowDetailModal(showDetailModal);

  // link height
  var linkHeight = opts.linkHeight || config.getLinkHeight();
  config.setLinkHeight(linkHeight);
}

// Start the rendering
function startRender(opts) {
  // transform options to config
  setConfig(opts);

  // start the process
  Marriage.init(page);
  Init.init(page)
    .then(function(){
      return Request.getTreeData(page);
    })
    .then(function(){
      return Render.render(page);
    }, function(e){
      console.log(e);
    });
}
exports.startRender = startRender;

},{"./config.js":2,"./depth.js":3,"./init.js":4,"./marriage.js":7,"./render.js":10,"./request.js":11}],7:[function(require,module,exports){
(function (global){
// Libs
var jquery = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var d3 = (typeof window !== "undefined" ? window['d3'] : typeof global !== "undefined" ? global['d3'] : null);

// Modules
var Modal = require('./modal.jsx');

// Components
var marriageCheckbox = jquery('.js-toggle-marriage');

// Init this module
function init(page) {
  marriageCheckbox.change(function(){
    if(marriageCheckbox.is(':checked')) {
      enableMarriage(page);
    } else {
      disableMarriage(page);
    }
  });
}
exports.init = init;

function createMarriageNode(page, node, data) {
  return d3.select(node).append("svg:image")
    .attr("xlink:href", data.picture)
    .attr("class", "marriage-image")
    .attr("x", -20)
    .attr("y", -68)
    .attr("height", "40px")
    .attr("width", "40px")
    .datum(data)
    .on('click', function(d){
      Modal.showPersonInfo(page, d);
    });
}

function enableMarriage(page) {
  var config = page.config;
  var duration = config.getTransitionDuration();
  config.setEnableMarriage(true);

  // get all visible nodes
  var nodes = d3.selectAll('g.node')[0];

  // loop
  nodes.forEach(function(node) {
    var order = 0;
    _.each(node.__data__.marriage, function(marriage) {
      var marriageNode = createMarriageNode(page, node, marriage);
      marriageNode
        .transition()
        .duration(duration)
        .attr('transform', 'translate (' + ((45 * order) + 45) + ',0)');
      order = order + 1;
    });
  });
}

function disableMarriage(page) {
  var config = page.config;
  var duration = config.getTransitionDuration();
  config.setEnableMarriage(false);

  // remove all marriage images
  d3.selectAll('image.marriage-image')
    .transition()
    .duration(duration)
    .attr("transform", "translate(0,0)")
    .remove();
}

function appendMarriages(page, nodeEnter) {
  var config = page.config;
  var enableMarriage = config.getEnableMarriage();

  if(enableMarriage) {
    _.each(nodeEnter[0], function(node){
      if(!!node) {
        var order = 0;
        _.each(node.__data__.marriage, function(marriage){
          var marriageNode = createMarriageNode(page, node, marriage);
          marriageNode
            .transition()
            .duration(0)
            .attr('transform', 'translate (' + ((45 * order) + 45) + ',0)');
          order = order + 1;
        });
      }
    });
  }
}
exports.appendMarriages = appendMarriages;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./modal.jsx":8}],8:[function(require,module,exports){
(function (global){
// Libs
var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var jquery = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

// Modal object
var PersonModal = React.createClass({displayName: "PersonModal",
  render: function() {
    return (
      React.createElement("div", {className: "modal fade person-info-modal js-person-info-modal", tabIndex: "-1", role: "dialog"}, 
        React.createElement("div", {className: "modal-dialog", role: "document"}, 
          React.createElement("div", {className: "modal-content"}, 
            React.createElement("div", {className: "modal-header"}, 
              React.createElement("button", {type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close"}, React.createElement("span", {"aria-hidden": "true"}, "×")), 
              React.createElement("h4", {className: "modal-title", id: "myModalLabel"}, 
                this.props["full-name"]
              )
            ), 
            React.createElement("div", {className: "modal-body"}, 
              React.createElement("div", {className: "person-info-left"}, 
                React.createElement("img", {className: "img-responsive", alt: "", src: this.props.picture})
              ), 
              React.createElement("div", {className: "person-info-right"}, 
                React.createElement("div", {className: "person-info-row"}, 
                  React.createElement("div", {className: "person-info-field"}, 
                    "Họ tên"
                  ), 
                  React.createElement("div", {className: "person-info-value"}, 
                    this.props["full-name"]
                  )
                ), 
                React.createElement("div", {className: "person-info-row"}, 
                  React.createElement("div", {className: "person-info-field"}, 
                    "Ngày Sinh"
                  ), 
                  React.createElement("div", {className: "person-info-value"}, 
                    this.props["birth-date"] ? this.props["birth-date"] : "Không rõ"
                  )
                ), 
                React.createElement("div", {className: "person-info-row"}, 
                  React.createElement("div", {className: "person-info-field"}, 
                    "Tình trạng"
                  ), 
                  React.createElement("div", {className: "person-info-value"}, 
                    this.props["alive-status"]
                  )
                )
              )
            ), 
            React.createElement("div", {className: "modal-footer"}, 
              React.createElement("a", {href: "/person/detail/" + this.props.id, className: "btn btn-success"}, "Chi tiết"), 
              this.props.isAuthenticated ? React.createElement("a", {href: "/person/add/childId/" + this.props.id, 
                                               className: "btn btn-primary"}, "Thêm Cha Mẹ")
               : null, 
              this.props.isAuthenticated ? React.createElement("a", {href: "/person/add/partnerId/" + this.props.id, 
                                               className: "btn btn-primary"}, "Thêm vợ chồng")
               : null, 
              this.props.isAuthenticated ? React.createElement("a", {href: "/person/add/parentId/" + this.props.id, 
                                               className: "btn btn-primary"}, "Thêm con")
               : null, 
              React.createElement("button", {type: "button", className: "btn btn-default", "data-dismiss": "modal"}, "Đóng")
            )
          )
        )
      )
    );
  }
});

// Render function
function showPersonInfo(page, info) {
  // is authenticated?
  info.isAuthenticated = page.config.isAuthenticated();

  // unmount first
  React.unmountComponentAtNode(
    document.getElementById("js-user-modal-container")
  );

  // render dom
  React.render(
    React.createElement(PersonModal, info),
    document.getElementById("js-user-modal-container")
  );

  // show modal
  jquery(".js-person-info-modal").modal();
}
exports.showPersonInfo = showPersonInfo;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],9:[function(require,module,exports){
(function (global){
// Libs
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var d3 = (typeof window !== "undefined" ? window['d3'] : typeof global !== "undefined" ? global['d3'] : null);

// Modules
var Render = require('./render.js');
var Util = require('./util.js');
var Marriage = require('./marriage');
var Modal = require('./modal.jsx');

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
  Marriage.appendMarriages(page, nodeEnter);
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
    .text(function(d) { return d.info["full-name"]; })
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
      Modal.showPersonInfo(page, d.info);
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./marriage":7,"./modal.jsx":8,"./render.js":10,"./util.js":12}],10:[function(require,module,exports){
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

},{"./links.js":5,"./nodes.js":9,"./util.js":12}],11:[function(require,module,exports){
(function (global){
var jquery = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var q = (typeof window !== "undefined" ? window['Q'] : typeof global !== "undefined" ? global['Q'] : null);

// Get tree data
// Returns a promise
function getTreeData(page) {
  var config = page.config;
  var rootId = config.getPersonId();
  var treeDepth = config.getTreeDepth();
  var url = "/tree/data";

  return q.Promise(function(resolve, reject){
    jquery.ajax({
      type: 'GET',
      data: {
        personId: rootId,
        depth: treeDepth
      },
      url: url,
      success: function(data) {
        page.root = data;
        resolve(data);
      }
    });
  });
}
exports.getTreeData = getTreeData;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],12:[function(require,module,exports){
(function (global){
// Libs
var d3 = (typeof window !== "undefined" ? window['d3'] : typeof global !== "undefined" ? global['d3'] : null);
var jquery = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVm9sdW1lcy90bXR4dC9Qcm9qZWN0cy9jbG9qdXJlLXBlZGlncmVlL2pzL2luZGV4LmpzIiwiL1ZvbHVtZXMvdG10eHQvUHJvamVjdHMvY2xvanVyZS1wZWRpZ3JlZS9qcy90cmVlL2NvbmZpZy5qcyIsIi9Wb2x1bWVzL3RtdHh0L1Byb2plY3RzL2Nsb2p1cmUtcGVkaWdyZWUvanMvdHJlZS9kZXB0aC5qcyIsIi9Wb2x1bWVzL3RtdHh0L1Byb2plY3RzL2Nsb2p1cmUtcGVkaWdyZWUvanMvdHJlZS9pbml0LmpzIiwiL1ZvbHVtZXMvdG10eHQvUHJvamVjdHMvY2xvanVyZS1wZWRpZ3JlZS9qcy90cmVlL2xpbmtzLmpzIiwiL1ZvbHVtZXMvdG10eHQvUHJvamVjdHMvY2xvanVyZS1wZWRpZ3JlZS9qcy90cmVlL21haW4uanMiLCIvVm9sdW1lcy90bXR4dC9Qcm9qZWN0cy9jbG9qdXJlLXBlZGlncmVlL2pzL3RyZWUvbWFycmlhZ2UuanMiLCIvVm9sdW1lcy90bXR4dC9Qcm9qZWN0cy9jbG9qdXJlLXBlZGlncmVlL2pzL3RyZWUvbW9kYWwuanN4IiwiL1ZvbHVtZXMvdG10eHQvUHJvamVjdHMvY2xvanVyZS1wZWRpZ3JlZS9qcy90cmVlL25vZGVzLmpzIiwiL1ZvbHVtZXMvdG10eHQvUHJvamVjdHMvY2xvanVyZS1wZWRpZ3JlZS9qcy90cmVlL3JlbmRlci5qcyIsIi9Wb2x1bWVzL3RtdHh0L1Byb2plY3RzL2Nsb2p1cmUtcGVkaWdyZWUvanMvdHJlZS9yZXF1ZXN0LmpzIiwiL1ZvbHVtZXMvdG10eHQvUHJvamVjdHMvY2xvanVyZS1wZWRpZ3JlZS9qcy90cmVlL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUNyQyxJQUFJLENBQUMs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QUN4QyxlQUFlLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztHQUMvQjtBQUNILEdBQUc7O0VBRUQsT0FBTyxlQUFlLENBQUM7QUFDekIsQ0FBQzs7QUFFRCxTQUFTLHVCQUF1QixDQUFDLElBQUksRUFBRTs7RUFFckMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztFQUN6QixJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7RUFDeEMsSUFBSSxRQUFRLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztDQUN4QyxJQUFJLFNBQVMsR0FBRyxDQUFDLFFBQVEsR0FBRyxVQUFVLElBQUksR0FBRyxDQUFDO0FBQy9DLEVBQUUsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ3REOztFQUVFLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7RUFDM0IsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7S0FDcEMsSUFBSSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztFQUM3QixhQUFhLENBQUMsT0FBTyxDQUFDO0lBQ3BCLE1BQU0sRUFBRSxTQUFTO0FBQ3JCLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNmOztFQUVFLE1BQU0sQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7Q0FDakM7QUFDRCxPQUFPLENBQUMsdUJBQXVCLEdBQUcsdUJBQXVCLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFRyZWUgPSByZXF1aXJlKCcuL3RyZWUvbWFpbi5qcycpO1xuVHJlZS5zdGFydFJlbmRlcih7XG4gIHNob3dEZXRhaWxNb2RhbDogZmFsc2UsXG4gIGxpbmtIZWlnaHQ6IDE1MFxufSk7XG4iLCIvLyBMaWJzXG52YXIganF1ZXJ5ID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgZDMgPSByZXF1aXJlKCdkMycpO1xuXG4vLyBDb25maWd1cmF0aW9uXG52YXIgY29uZmlnID0ge307XG5cbi8vIExpbmsgaGVpZ2h0XG5jb25maWcubGlua0hlaWdodCA9IDIwMDtcbmNvbmZpZy5nZXRMaW5rSGVpZ2h0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmxpbmtIZWlnaHQ7XG59O1xuY29uZmlnLnNldExpbmtIZWlnaHQgPSBmdW5jdGlvbih2YWwpIHtcbiAgdGhpcy5saW5rSGVpZ2h0ID0gdmFsO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIFRyZWUgY29udGFpbmVyIGlkXG5jb25maWcuY29udGFpbmVySWQgPSBcIiNqcy10cmVlLWNvbnRhaW5lclwiO1xuY29uZmlnLmdldENvbnRhaW5lcklkID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmNvbnRhaW5lcklkO1xufTtcblxuLy8gRW5hYmxlIG1hcnJpYWdlIGRpc3BsYXlcbmNvbmZpZy5lbmFibGVNYXJyaWFnZSA9IGZhbHNlO1xuY29uZmlnLmdldEVuYWJsZU1hcnJpYWdlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmVuYWJsZU1hcnJpYWdlO1xufTtcbmNvbmZpZy5zZXRFbmFibGVNYXJyaWFnZSA9IGZ1bmN0aW9uKHZhbCkge1xuICB0aGlzLmVuYWJsZU1hcnJpYWdlID0gdmFsO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIFRyZWUgd2lkdGhcbmNvbmZpZy50cmVlV2lkdGggPSBqcXVlcnkoY29uZmlnLmNvbnRhaW5lcklkKS53aWR0aCgpO1xuY29uZmlnLmdldFRyZWVXaWR0aCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy50cmVlV2lkdGg7XG59O1xuY29uZmlnLnNldFRyZWVXaWR0aCA9IGZ1bmN0aW9uKHZhbCkge1xuICB0aGlzLnRyZWVXaWR0aCA9IHZhbDtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBUcmVlIGhlaWdodFxuY29uZmlnLnRyZWVIZWlnaHQgPSAxMDAwO1xuY29uZmlnLmdldFRyZWVIZWlnaHQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMudHJlZUhlaWdodDtcbn07XG5jb25maWcuc2V0VHJlZUhlaWdodCA9IGZ1bmN0aW9uKHZhbCkge1xuICB0aGlzLnRyZWVIZWlnaHQgPSB2YWw7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gVHJhbnNpdGlvbiBkdXJhdGlvblxuY29uZmlnLmdldFRyYW5zaXRpb25EdXJhdGlvbiA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gZDMuZXZlbnQgJiYgZDMuZXZlbnQuYWx0S2V5ID8gNTAwMCA6IDUwMDtcbn07XG5cbi8vIEFsbG93IHNob3cgbW9kYWwgb24gY2xpY2tcbmNvbmZpZy5zaG93RGV0YWlsTW9kYWwgPSB0cnVlO1xuY29uZmlnLmdldFNob3dEZXRhaWxNb2RhbCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5zaG93RGV0YWlsTW9kYWw7XG59O1xuY29uZmlnLnNldFNob3dEZXRhaWxNb2RhbCA9IGZ1bmN0aW9uKHZhbCkge1xuICB0aGlzLnNob3dEZXRhaWxNb2RhbCA9IHZhbDtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBJcyBhdXRoZW50aWNhdGVkP1xuY29uZmlnLmlzQXV0aGVudGljYXRlZCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaXNBdXRoZW50aWNhdGVkID0gd2luZG93LmlzQXV0aGVudGljYXRlZCB8fCBmYWxzZTtcbiAgcmV0dXJuIGlzQXV0aGVudGljYXRlZDtcbn07XG5cbi8vIFJvb3QgcGVyc29uIGlkXG5jb25maWcucGVyc29uSWQgPSB3aW5kb3cucGVyc29uSWQ7XG5jb25maWcuZ2V0UGVyc29uSWQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMucGVyc29uSWQ7XG59O1xuXG4vLyBUcmVlIGRlcHRoXG5jb25maWcudHJlZURlcHRoID0gd2luZG93LnRyZWVEZXB0aDtcbmNvbmZpZy5nZXRUcmVlRGVwdGggPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMudHJlZURlcHRoO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb25maWc7XG4iLCIvLyBsaWJzXG52YXIganF1ZXJ5ID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcuanMnKTtcblxuLy8gZWxlbWVudHNcbnZhciB1cGRhdGVEZXB0aEJ1dHRvbiA9IGpxdWVyeSgnLmpzLXVwZGF0ZS10cmVlLWRlcHRoJyk7XG52YXIgdHJlZURlcHRoSW5wdXQgPSBqcXVlcnkoJy5qcy10cmVlLWRlcHRoLWlucHV0Jyk7XG5cbi8vIGluaXQgdmFsdWUgZm9yIHRyZWUgZGVwdGggaW5wdXRcbnZhciB0cmVlRGVwdGggPSBjb25maWcuZ2V0VHJlZURlcHRoKCk7XG5pZiAoISF0cmVlRGVwdGgpIHtcbiAgdHJlZURlcHRoSW5wdXQudmFsKHRyZWVEZXB0aCk7XG59XG5cbi8vIG9uIHVwZGF0ZSBkZXB0aFxudXBkYXRlRGVwdGhCdXR0b24uY2xpY2soZnVuY3Rpb24oKXtcbiAgdmFyIGRlcHRoO1xuICBkZXB0aCA9IHRyZWVEZXB0aElucHV0LnZhbCgpO1xuICBkZXB0aCA9IHBhcnNlSW50KGRlcHRoKTtcblxuICB2YXIgcGVyc29uSWQgPSBjb25maWcuZ2V0UGVyc29uSWQoKTtcblxuICBpZiAoIWlzTmFOKGRlcHRoKSkge1xuICAgIGlmICghIXBlcnNvbklkKSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZSgnL3RyZWUvdmlldy9wZXJzb24vJyArIHBlcnNvbklkICsgJy9kZXB0aC8nICsgZGVwdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZSgnL3RyZWUvdmlldy9kZXB0aC8nICsgZGVwdGgpO1xuICAgIH1cbiAgfVxufSk7XG4iLCIvLyBJbml0XG52YXIgcSA9IHJlcXVpcmUoJ3EnKTtcbnZhciBkMyA9IHJlcXVpcmUoJ2QzJyk7XG5cbi8vIEdlbmVyYWwgaW5pdCBmdW5jdGlvblxuLy8gUmV0dXJucyBhIHByb21pc2UsIHJlc29sdmUgd2hlbiBmaW5pc2ggaW5pdGlhbGl6aW5nXG5mdW5jdGlvbiBpbml0KHBhZ2UpIHtcbiAgcmV0dXJuIHEuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKXtcbiAgICBpbml0TGF5b3V0KHBhZ2UpOyAgICAgICAgICAgLy8gSW5pdCB0aGUgZDMgdHJlZSBsYXlvdXRcbiAgICBpbml0U3ZnKHBhZ2UpOyAgICAgICAgICAgICAgLy8gSW5pdCB0aGUgcm9vdCBzdmcgdGFnIGZvciBob2xkaW5nIG90aGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVsZW1lbnRzXG4gICAgcmVzb2x2ZSgpOyAgICAgICAgICAgICAgICAgIC8vIEZpbmlzaCB0aGUgcHJvbWlzZVxuICB9KTtcbn1cbmV4cG9ydHMuaW5pdCA9IGluaXQ7XG5cbi8vIEluaXQgdGhlIGQzIHRyZWUgbGF5b3V0XG5mdW5jdGlvbiBpbml0TGF5b3V0KHBhZ2UpIHtcbiAgdmFyIGNvbmZpZyA9IHBhZ2UuY29uZmlnO1xuICB2YXIgdHJlZVdpZHRoID0gY29uZmlnLmdldFRyZWVXaWR0aCgpO1xuICB2YXIgdHJlZUhlaWdodCA9IGNvbmZpZy5nZXRUcmVlSGVpZ2h0KCk7XG5cbiAgcGFnZS50cmVlTGF5b3V0ID0gZDMubGF5b3V0LnRyZWUoKS5zaXplKFt0cmVlV2lkdGgsIHRyZWVIZWlnaHRdKTtcbiAgcGFnZS5kaWFnb25hbCA9IGQzLnN2Zy5kaWFnb25hbCgpLnByb2plY3Rpb24oZnVuY3Rpb24oZCkgeyByZXR1cm4gW2QueCwgZC55XTsgfSk7XG59XG5cbi8vIGluaXQgdGhlIFNWRyBlbGVtZW50c1xuZnVuY3Rpb24gaW5pdFN2ZyhwYWdlKSB7XG4gIHZhciBjb25maWcgPSBwYWdlLmNvbmZpZztcbiAgdmFyIGNvbnRhaW5lcklkID0gY29uZmlnLmdldENvbnRhaW5lcklkKCk7XG4gIHZhciB0cmVlV2lkdGggPSBjb25maWcuZ2V0VHJlZVdpZHRoKCk7XG4gIHZhciB0cmVlSGVpZ2h0ID0gY29uZmlnLmdldFRyZWVIZWlnaHQoKTtcblxuICAvLyBTVkcgcm9vdCwgZm9yIGhvbGRpbmcgYWxsIHRoZSB0cmVlIGVsZW1lbnRzXG4gIHBhZ2Uucm9vdFN2ZyA9IGQzLnNlbGVjdChjb250YWluZXJJZCkuYXBwZW5kKFwic3ZnOnN2Z1wiKVxuICAgIC5hdHRyKFwid2lkdGhcIiwgdHJlZVdpZHRoKVxuICAgIC5hdHRyKFwiaGVpZ2h0XCIsIHRyZWVIZWlnaHQpO1xuXG4gIC8vIFN2ZyByb290IGdyb3VwXG4gIHBhZ2Uucm9vdEdyb3VwID0gcGFnZS5yb290U3ZnLmFwcGVuZChcInN2ZzpnXCIpXG4gICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAwICsgXCIsXCIgKyAwICsgXCIpXCIpO1xufVxuIiwiZnVuY3Rpb24gdXBkYXRlTGlua3MocGFnZSwgc291cmNlLCBub2Rlc0xpc3QpIHtcbiAgdmFyIGNvbmZpZyA9IHBhZ2UuY29uZmlnO1xuICB2YXIgZHVyYXRpb24gPSBjb25maWcuZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCk7XG5cbiAgLy8gQmluZCBkYXRhIHRvIHRoZSBsaW5rcyAobm90IGFjdHVhbGx5IGNyZWF0ZSB0aGUgZWxlbWVudHMpXG4gIHZhciBsaW5rc0dyb3VwID0gcGFnZS5yb290R3JvdXAuc2VsZWN0QWxsKFwicGF0aC5saW5rXCIpXG4gICAgICAuZGF0YShwYWdlLnRyZWVMYXlvdXQubGlua3Mobm9kZXNMaXN0KSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC50YXJnZXQuaWQ7IH0pO1xuXG4gIGVudGVyKHBhZ2UsIHNvdXJjZSwgbGlua3NHcm91cCk7XG4gIHVwZGF0ZShwYWdlLCBzb3VyY2UsIGxpbmtzR3JvdXApO1xuICBleGl0KHBhZ2UsIHNvdXJjZSwgbGlua3NHcm91cCk7XG5cbn1cbmV4cG9ydHMudXBkYXRlTGlua3MgPSB1cGRhdGVMaW5rcztcblxuZnVuY3Rpb24gZW50ZXIocGFnZSwgc291cmNlLCBsaW5rc0dyb3VwKSB7XG4gIHZhciBjb25maWcgPSBwYWdlLmNvbmZpZztcbiAgdmFyIGR1cmF0aW9uID0gY29uZmlnLmdldFRyYW5zaXRpb25EdXJhdGlvbigpO1xuXG4gIC8vIGNyZWF0ZSBtaXNzaW5nIGxpbmtzIGlmIG5lY2Vzc2FyeVxuICBsaW5rc0dyb3VwLmVudGVyKCkuaW5zZXJ0KFwic3ZnOnBhdGhcIiwgXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBcImxpbmtcIilcbiAgICAuYXR0cihcImRcIiwgZnVuY3Rpb24oZCkge1xuICAgICAgdmFyIG8gPSB7eDogc291cmNlLngwLCB5OiBzb3VyY2UueTB9O1xuICAgICAgcmV0dXJuIHBhZ2UuZGlhZ29uYWwoe3NvdXJjZTogbywgdGFyZ2V0OiBvfSk7XG4gICAgfSlcbiAgICAudHJhbnNpdGlvbigpXG4gICAgLmR1cmF0aW9uKGR1cmF0aW9uKVxuICAgIC5hdHRyKFwiZFwiLCBwYWdlLmRpYWdvbmFsKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlKHBhZ2UsIHNvdXJjZSwgbGlua3NHcm91cCkge1xuICB2YXIgY29uZmlnID0gcGFnZS5jb25maWc7XG4gIHZhciBkdXJhdGlvbiA9IGNvbmZpZy5nZXRUcmFuc2l0aW9uRHVyYXRpb24oKTtcblxuICAvLyB0cmFuc2l0aW9uIGxpbmtzXG4gIGxpbmtzR3JvdXAudHJhbnNpdGlvbigpXG4gICAgLmR1cmF0aW9uKGR1cmF0aW9uKVxuICAgIC5hdHRyKFwiZFwiLCBwYWdlLmRpYWdvbmFsKTtcbn1cblxuZnVuY3Rpb24gZXhpdChwYWdlLCBzb3VyY2UsIGxpbmtzR3JvdXApIHtcbiAgdmFyIGNvbmZpZyA9IHBhZ2UuY29uZmlnO1xuICB2YXIgZHVyYXRpb24gPSBjb25maWcuZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCk7XG5cbiAgLy8gcmVtb3ZlIHVuLXVzZWQgbGlua3NcbiAgbGlua3NHcm91cC5leGl0KCkudHJhbnNpdGlvbigpXG4gICAgLmR1cmF0aW9uKGR1cmF0aW9uKVxuICAgIC5hdHRyKFwiZFwiLCBmdW5jdGlvbihkKSB7XG4gICAgICB2YXIgbyA9IHt4OiBzb3VyY2UueCwgeTogc291cmNlLnl9O1xuICAgICAgcmV0dXJuIHBhZ2UuZGlhZ29uYWwoe3NvdXJjZTogbywgdGFyZ2V0OiBvfSk7XG4gICAgfSlcbiAgICAucmVtb3ZlKCk7XG59XG4iLCJ2YXIgUmVxdWVzdCA9IHJlcXVpcmUoJy4vcmVxdWVzdC5qcycpO1xudmFyIENvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnLmpzJyk7XG52YXIgSW5pdCA9IHJlcXVpcmUoJy4vaW5pdC5qcycpO1xudmFyIFJlbmRlciA9IHJlcXVpcmUoJy4vcmVuZGVyLmpzJyk7XG52YXIgTWFycmlhZ2UgPSByZXF1aXJlKCcuL21hcnJpYWdlLmpzJyk7XG52YXIgRGVwdGggPSByZXF1aXJlKCcuL2RlcHRoLmpzJyk7XG5cbi8vIEdsb2JhbCBwYWdlIG9iamVjdFxudmFyIHBhZ2UgPSB7XG4gIGNvbmZpZzogbnVsbCxcbiAgdHJlZUxheW91dDogbnVsbCxcbiAgZGlhZ29uYWw6IG51bGwsXG4gIHJvb3RTdmc6IG51bGwsXG4gIHRyZWVEYXRhOiBudWxsXG59O1xucGFnZS5jb25maWcgPSBDb25maWc7XG5cbi8vIE9wdGlvbnMgdG8gQ29uZmlnXG5mdW5jdGlvbiBzZXRDb25maWcob3B0cykge1xuICB2YXIgY29uZmlnID0gcGFnZS5jb25maWc7XG5cbiAgLy8gb3B0aW9uc1xuICBvcHRzID0gb3B0cyB8fCB7fTtcblxuICAvLyBzaG93IGRldGFpbCBtb2RhbFxuICB2YXIgc2hvd0RldGFpbE1vZGFsID0gb3B0cy5zaG93RGV0YWlsTW9kYWwgfHwgZmFsc2U7XG4gIGNvbmZpZy5zZXRTaG93RGV0YWlsTW9kYWwoc2hvd0RldGFpbE1vZGFsKTtcblxuICAvLyBsaW5rIGhlaWdodFxuICB2YXIgbGlua0hlaWdodCA9IG9wdHMubGlua0hlaWdodCB8fCBjb25maWcuZ2V0TGlua0hlaWdodCgpO1xuICBjb25maWcuc2V0TGlua0hlaWdodChsaW5rSGVpZ2h0KTtcbn1cblxuLy8gU3RhcnQgdGhlIHJlbmRlcmluZ1xuZnVuY3Rpb24gc3RhcnRSZW5kZXIob3B0cykge1xuICAvLyB0cmFuc2Zvcm0gb3B0aW9ucyB0byBjb25maWdcbiAgc2V0Q29uZmlnKG9wdHMpO1xuXG4gIC8vIHN0YXJ0IHRoZSBwcm9jZXNzXG4gIE1hcnJpYWdlLmluaXQocGFnZSk7XG4gIEluaXQuaW5pdChwYWdlKVxuICAgIC50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gUmVxdWVzdC5nZXRUcmVlRGF0YShwYWdlKTtcbiAgICB9KVxuICAgIC50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gUmVuZGVyLnJlbmRlcihwYWdlKTtcbiAgICB9LCBmdW5jdGlvbihlKXtcbiAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgIH0pO1xufVxuZXhwb3J0cy5zdGFydFJlbmRlciA9IHN0YXJ0UmVuZGVyO1xuIiwiLy8gTGlic1xudmFyIGpxdWVyeSA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIF8gPSByZXF1aXJlKCdfJyk7XG52YXIgZDMgPSByZXF1aXJlKCdkMycpO1xuXG4vLyBNb2R1bGVzXG52YXIgTW9kYWwgPSByZXF1aXJlKCcuL21vZGFsLmpzeCcpO1xuXG4vLyBDb21wb25lbnRzXG52YXIgbWFycmlhZ2VDaGVja2JveCA9IGpxdWVyeSgnLmpzLXRvZ2dsZS1tYXJyaWFnZScpO1xuXG4vLyBJbml0IHRoaXMgbW9kdWxlXG5mdW5jdGlvbiBpbml0KHBhZ2UpIHtcbiAgbWFycmlhZ2VDaGVja2JveC5jaGFuZ2UoZnVuY3Rpb24oKXtcbiAgICBpZihtYXJyaWFnZUNoZWNrYm94LmlzKCc6Y2hlY2tlZCcpKSB7XG4gICAgICBlbmFibGVNYXJyaWFnZShwYWdlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGlzYWJsZU1hcnJpYWdlKHBhZ2UpO1xuICAgIH1cbiAgfSk7XG59XG5leHBvcnRzLmluaXQgPSBpbml0O1xuXG5mdW5jdGlvbiBjcmVhdGVNYXJyaWFnZU5vZGUocGFnZSwgbm9kZSwgZGF0YSkge1xuICByZXR1cm4gZDMuc2VsZWN0KG5vZGUpLmFwcGVuZChcInN2ZzppbWFnZVwiKVxuICAgIC5hdHRyKFwieGxpbms6aHJlZlwiLCBkYXRhLnBpY3R1cmUpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBcIm1hcnJpYWdlLWltYWdlXCIpXG4gICAgLmF0dHIoXCJ4XCIsIC0yMClcbiAgICAuYXR0cihcInlcIiwgLTY4KVxuICAgIC5hdHRyKFwiaGVpZ2h0XCIsIFwiNDBweFwiKVxuICAgIC5hdHRyKFwid2lkdGhcIiwgXCI0MHB4XCIpXG4gICAgLmRhdHVtKGRhdGEpXG4gICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uKGQpe1xuICAgICAgTW9kYWwuc2hvd1BlcnNvbkluZm8ocGFnZSwgZCk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGVuYWJsZU1hcnJpYWdlKHBhZ2UpIHtcbiAgdmFyIGNvbmZpZyA9IHBhZ2UuY29uZmlnO1xuICB2YXIgZHVyYXRpb24gPSBjb25maWcuZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCk7XG4gIGNvbmZpZy5zZXRFbmFibGVNYXJyaWFnZSh0cnVlKTtcblxuICAvLyBnZXQgYWxsIHZpc2libGUgbm9kZXNcbiAgdmFyIG5vZGVzID0gZDMuc2VsZWN0QWxsKCdnLm5vZGUnKVswXTtcblxuICAvLyBsb29wXG4gIG5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSkge1xuICAgIHZhciBvcmRlciA9IDA7XG4gICAgXy5lYWNoKG5vZGUuX19kYXRhX18ubWFycmlhZ2UsIGZ1bmN0aW9uKG1hcnJpYWdlKSB7XG4gICAgICB2YXIgbWFycmlhZ2VOb2RlID0gY3JlYXRlTWFycmlhZ2VOb2RlKHBhZ2UsIG5vZGUsIG1hcnJpYWdlKTtcbiAgICAgIG1hcnJpYWdlTm9kZVxuICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgIC5kdXJhdGlvbihkdXJhdGlvbilcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUgKCcgKyAoKDQ1ICogb3JkZXIpICsgNDUpICsgJywwKScpO1xuICAgICAgb3JkZXIgPSBvcmRlciArIDE7XG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkaXNhYmxlTWFycmlhZ2UocGFnZSkge1xuICB2YXIgY29uZmlnID0gcGFnZS5jb25maWc7XG4gIHZhciBkdXJhdGlvbiA9IGNvbmZpZy5nZXRUcmFuc2l0aW9uRHVyYXRpb24oKTtcbiAgY29uZmlnLnNldEVuYWJsZU1hcnJpYWdlKGZhbHNlKTtcblxuICAvLyByZW1vdmUgYWxsIG1hcnJpYWdlIGltYWdlc1xuICBkMy5zZWxlY3RBbGwoJ2ltYWdlLm1hcnJpYWdlLWltYWdlJylcbiAgICAudHJhbnNpdGlvbigpXG4gICAgLmR1cmF0aW9uKGR1cmF0aW9uKVxuICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsMClcIilcbiAgICAucmVtb3ZlKCk7XG59XG5cbmZ1bmN0aW9uIGFwcGVuZE1hcnJpYWdlcyhwYWdlLCBub2RlRW50ZXIpIHtcbiAgdmFyIGNvbmZpZyA9IHBhZ2UuY29uZmlnO1xuICB2YXIgZW5hYmxlTWFycmlhZ2UgPSBjb25maWcuZ2V0RW5hYmxlTWFycmlhZ2UoKTtcblxuICBpZihlbmFibGVNYXJyaWFnZSkge1xuICAgIF8uZWFjaChub2RlRW50ZXJbMF0sIGZ1bmN0aW9uKG5vZGUpe1xuICAgICAgaWYoISFub2RlKSB7XG4gICAgICAgIHZhciBvcmRlciA9IDA7XG4gICAgICAgIF8uZWFjaChub2RlLl9fZGF0YV9fLm1hcnJpYWdlLCBmdW5jdGlvbihtYXJyaWFnZSl7XG4gICAgICAgICAgdmFyIG1hcnJpYWdlTm9kZSA9IGNyZWF0ZU1hcnJpYWdlTm9kZShwYWdlLCBub2RlLCBtYXJyaWFnZSk7XG4gICAgICAgICAgbWFycmlhZ2VOb2RlXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuZHVyYXRpb24oMClcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlICgnICsgKCg0NSAqIG9yZGVyKSArIDQ1KSArICcsMCknKTtcbiAgICAgICAgICBvcmRlciA9IG9yZGVyICsgMTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbmV4cG9ydHMuYXBwZW5kTWFycmlhZ2VzID0gYXBwZW5kTWFycmlhZ2VzO1xuIiwiLy8gTGlic1xudmFyIFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xudmFyIGpxdWVyeSA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG5cbi8vIE1vZGFsIG9iamVjdFxudmFyIFBlcnNvbk1vZGFsID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsIGZhZGUgcGVyc29uLWluZm8tbW9kYWwganMtcGVyc29uLWluZm8tbW9kYWxcIiB0YWJJbmRleD1cIi0xXCIgcm9sZT1cImRpYWxvZ1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWRpYWxvZ1wiIHJvbGU9XCJkb2N1bWVudFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtY29udGVudFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPjxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZ0aW1lczs8L3NwYW4+PC9idXR0b24+XG4gICAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJtb2RhbC10aXRsZVwiIGlkPVwibXlNb2RhbExhYmVsXCI+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHNbXCJmdWxsLW5hbWVcIl19XG4gICAgICAgICAgICAgIDwvaDQ+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtYm9keVwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBlcnNvbi1pbmZvLWxlZnRcIj5cbiAgICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImltZy1yZXNwb25zaXZlXCIgYWx0PVwiXCIgc3JjPXt0aGlzLnByb3BzLnBpY3R1cmV9Lz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGVyc29uLWluZm8tcmlnaHRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBlcnNvbi1pbmZvLXJvd1wiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwZXJzb24taW5mby1maWVsZFwiPlxuICAgICAgICAgICAgICAgICAgICBI4buNIHTDqm5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwZXJzb24taW5mby12YWx1ZVwiPlxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wc1tcImZ1bGwtbmFtZVwiXX1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGVyc29uLWluZm8tcm93XCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBlcnNvbi1pbmZvLWZpZWxkXCI+XG4gICAgICAgICAgICAgICAgICAgIE5nw6B5IFNpbmhcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwZXJzb24taW5mby12YWx1ZVwiPlxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wc1tcImJpcnRoLWRhdGVcIl0gPyB0aGlzLnByb3BzW1wiYmlydGgtZGF0ZVwiXSA6IFwiS2jDtG5nIHLDtVwifVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwZXJzb24taW5mby1yb3dcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGVyc29uLWluZm8tZmllbGRcIj5cbiAgICAgICAgICAgICAgICAgICAgVMOsbmggdHLhuqFuZ1xuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBlcnNvbi1pbmZvLXZhbHVlXCI+XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzW1wiYWxpdmUtc3RhdHVzXCJdfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWZvb3RlclwiPlxuICAgICAgICAgICAgICA8YSBocmVmPXtcIi9wZXJzb24vZGV0YWlsL1wiICsgdGhpcy5wcm9wcy5pZH0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1zdWNjZXNzXCI+Q2hpIHRp4bq/dDwvYT5cbiAgICAgICAgICAgICAge3RoaXMucHJvcHMuaXNBdXRoZW50aWNhdGVkID8gPGEgaHJlZj17XCIvcGVyc29uL2FkZC9jaGlsZElkL1wiICsgdGhpcy5wcm9wcy5pZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCI+VGjDqm0gQ2hhIE3hurk8L2E+XG4gICAgICAgICAgICAgICA6IG51bGwgfVxuICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5pc0F1dGhlbnRpY2F0ZWQgPyA8YSBocmVmPXtcIi9wZXJzb24vYWRkL3BhcnRuZXJJZC9cIiArIHRoaXMucHJvcHMuaWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiPlRow6ptIHbhu6MgY2jhu5NuZzwvYT5cbiAgICAgICAgICAgICAgIDogbnVsbCB9XG4gICAgICAgICAgICAgIHt0aGlzLnByb3BzLmlzQXV0aGVudGljYXRlZCA/IDxhIGhyZWY9e1wiL3BlcnNvbi9hZGQvcGFyZW50SWQvXCIgKyB0aGlzLnByb3BzLmlkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIj5UaMOqbSBjb248L2E+XG4gICAgICAgICAgICAgICA6IG51bGwgfVxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPsSQw7NuZzwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG5cbi8vIFJlbmRlciBmdW5jdGlvblxuZnVuY3Rpb24gc2hvd1BlcnNvbkluZm8ocGFnZSwgaW5mbykge1xuICAvLyBpcyBhdXRoZW50aWNhdGVkP1xuICBpbmZvLmlzQXV0aGVudGljYXRlZCA9IHBhZ2UuY29uZmlnLmlzQXV0aGVudGljYXRlZCgpO1xuXG4gIC8vIHVubW91bnQgZmlyc3RcbiAgUmVhY3QudW5tb3VudENvbXBvbmVudEF0Tm9kZShcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpzLXVzZXItbW9kYWwtY29udGFpbmVyXCIpXG4gICk7XG5cbiAgLy8gcmVuZGVyIGRvbVxuICBSZWFjdC5yZW5kZXIoXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChQZXJzb25Nb2RhbCwgaW5mbyksXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJqcy11c2VyLW1vZGFsLWNvbnRhaW5lclwiKVxuICApO1xuXG4gIC8vIHNob3cgbW9kYWxcbiAganF1ZXJ5KFwiLmpzLXBlcnNvbi1pbmZvLW1vZGFsXCIpLm1vZGFsKCk7XG59XG5leHBvcnRzLnNob3dQZXJzb25JbmZvID0gc2hvd1BlcnNvbkluZm87XG4iLCIvLyBMaWJzXG52YXIgXyA9IHJlcXVpcmUoJ18nKTtcbnZhciBkMyA9IHJlcXVpcmUoJ2QzJyk7XG5cbi8vIE1vZHVsZXNcbnZhciBSZW5kZXIgPSByZXF1aXJlKCcuL3JlbmRlci5qcycpO1xudmFyIFV0aWwgPSByZXF1aXJlKCcuL3V0aWwuanMnKTtcbnZhciBNYXJyaWFnZSA9IHJlcXVpcmUoJy4vbWFycmlhZ2UnKTtcbnZhciBNb2RhbCA9IHJlcXVpcmUoJy4vbW9kYWwuanN4Jyk7XG5cbi8vIFZhcmlhYmxlc1xudmFyIGlkID0gMDtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIEZ1bmN0aW9ucyBmb3IgcHJvY2Vzc2luZyB0aGUgdHJlZSBub2Rlc1xuZnVuY3Rpb24gdXBkYXRlTm9kZXMocGFnZSwgc291cmNlLCBub2Rlc0xpc3QpIHtcbiAgdmFyIHRyZWVMYXlvdXQgPSBwYWdlLnRyZWVMYXlvdXQ7XG4gIHZhciB0cmVlRGF0YSA9IHBhZ2Uucm9vdDtcblxuICAvLyBCaW5kIGRhdGEgdG8gdGhlIHN2ZyBub2RlcyAobm90IGFjdHVhbCBub2RlcyBub3cpXG4gIHZhciBub2RlR3JvdXBzID0gcGFnZS5yb290R3JvdXAuc2VsZWN0QWxsKFwiZy5ub2RlXCIpXG4gICAgICAuZGF0YShub2Rlc0xpc3QsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuaWQgfHwgKGQuaWQgPSArK2lkKTsgfSk7XG5cbiAgZW50ZXIocGFnZSwgc291cmNlLCBub2RlR3JvdXBzKTtcbiAgdXBkYXRlKHBhZ2UsIHNvdXJjZSwgbm9kZUdyb3Vwcyk7XG4gIGV4aXQocGFnZSwgc291cmNlLCBub2RlR3JvdXBzKTtcbn1cbmV4cG9ydHMudXBkYXRlTm9kZXMgPSB1cGRhdGVOb2RlcztcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIEVudGVyXG5mdW5jdGlvbiBlbnRlcihwYWdlLCBzb3VyY2UsIG5vZGVHcm91cHMpIHtcbiAgLy8gTm93IGFjdHVhbGx5IGNyZWF0ZSBuZXcgbm9kZSBncm91cCBpZiBub3QgZXhpc3RcbiAgdmFyIG5vZGVFbnRlciA9IG5vZGVHcm91cHMuZW50ZXIoKS5hcHBlbmQoXCJzdmc6Z1wiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm5vZGVcIilcbiAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgc291cmNlLngwICsgXCIsXCIgKyBzb3VyY2UueTAgKyBcIilcIjsgfSk7XG4gIC8vIENyZWF0ZSB0aGUgZWxlbWVudHMgaW5zaWRlIHRoYXQgbm9kZSBncm91cFxuICBhcHBlbmRDaXJjbGVzKHBhZ2UsIG5vZGVFbnRlcik7XG4gIGFwcGVuZE5hbWVzKHBhZ2UsIG5vZGVFbnRlcik7XG4gIGFwcGVuZEltYWdlcyhwYWdlLCBub2RlRW50ZXIpO1xuICBNYXJyaWFnZS5hcHBlbmRNYXJyaWFnZXMocGFnZSwgbm9kZUVudGVyKTtcbn1cblxuZnVuY3Rpb24gYXBwZW5kQ2lyY2xlcyhwYWdlLCBub2RlRW50ZXIpIHtcbiAgLy8gVGhlIGNpcmNsZSB0byBjbGljayBmb3IgZXhwYW5kaW5nXG4gIG5vZGVFbnRlci5hcHBlbmQoXCJzdmc6Y2lyY2xlXCIpXG5cdFx0Lm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oZCkge1xuICAgICAgVXRpbC50b2dnbGUoZCk7XG4gICAgICBSZW5kZXIudXBkYXRlKHBhZ2UsIGQpOyAvLyBVcGRhdGUgdGhlIHRyZWUgYWdhaW5cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gYXBwZW5kTmFtZXMocGFnZSwgbm9kZUVudGVyKSB7XG4gIC8vIFBlcnNvbiBuYW1lXG4gIG5vZGVFbnRlci5hcHBlbmQoXCJzdmc6dGV4dFwiKVxuICAgIC50ZXh0KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuaW5mb1tcImZ1bGwtbmFtZVwiXTsgfSlcbiAgICAuYXR0cihcInlcIiwgLTE5KVxuICAgIC5hdHRyKFwiZHlcIiwgXCIuMzVlbVwiKVxuICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcbiAgICAuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgMSk7XG59XG5cbmZ1bmN0aW9uIGFwcGVuZEltYWdlcyhwYWdlLCBub2RlRW50ZXIpIHtcbiAgLy8gUGVyc29uIGltYWdlXG4gIG5vZGVFbnRlci5hcHBlbmQoXCJzdmc6aW1hZ2VcIilcbiAgICAuYXR0cihcInhsaW5rOmhyZWZcIiwgZnVuY3Rpb24oZCl7XG4gICAgICByZXR1cm4gZC5pbmZvLnBpY3R1cmU7XG4gICAgfSlcbiAgICAuYXR0cihcInhcIiwgLTIwKVxuICAgIC5hdHRyKFwieVwiLCAtNjgpXG4gICAgLmF0dHIoXCJoZWlnaHRcIiwgXCI0MHB4XCIpXG4gICAgLmF0dHIoXCJ3aWR0aFwiLCBcIjQwcHhcIilcbiAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24oZCl7XG4gICAgICBNb2RhbC5zaG93UGVyc29uSW5mbyhwYWdlLCBkLmluZm8pO1xuICAgIH0pO1xufVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gVXBkYXRlXG5mdW5jdGlvbiB1cGRhdGUocGFnZSwgc291cmNlLCBub2RlR3JvdXBzKSB7XG4gIHZhciBjb25maWcgPSBwYWdlLmNvbmZpZztcbiAgdmFyIGR1cmF0aW9uID0gY29uZmlnLmdldFRyYW5zaXRpb25EdXJhdGlvbigpO1xuXG4gIC8vIFVwZGF0ZSB0aGUgZGF0YSBhbmQgdHJhbnNpdGlvbiBub2RlcyB0byB0aGVpciBuZXcgcG9zaXRpb24uXG4gIHZhciBub2RlVXBkYXRlID0gbm9kZUdyb3Vwcy50cmFuc2l0aW9uKClcbiAgICAgIC5kdXJhdGlvbihkdXJhdGlvbilcbiAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdCAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgZC54ICsgXCIsXCIgKyBkLnkgKyBcIilcIjtcbiAgICAgIH0pO1xuICBub2RlVXBkYXRlLnNlbGVjdChcImNpcmNsZVwiKVxuICAgIC5hdHRyKFwiclwiLCAxMClcbiAgICAuc3R5bGUoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuX2NoaWxkcmVuID8gXCJsaWdodHN0ZWVsYmx1ZVwiIDogXCIjZmZmXCI7IH0pO1xufVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gRXhpdFxuZnVuY3Rpb24gZXhpdChwYWdlLCBzb3VyY2UsIG5vZGVHcm91cHMpIHtcbiAgdmFyIGNvbmZpZyA9IHBhZ2UuY29uZmlnO1xuICB2YXIgZHVyYXRpb24gPSBjb25maWcuZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCk7XG5cbiAgLy8gVHJhbnNpdGlvbiBleGl0aW5nIG5vZGVzIHRvIHRoZSBwYXJlbnQncyBuZXcgcG9zaXRpb24uXG4gIHZhciBub2RlRXhpdCA9IG5vZGVHcm91cHMuZXhpdCgpLnRyYW5zaXRpb24oKVxuICAgICAgLmR1cmF0aW9uKGR1cmF0aW9uKVxuICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyBzb3VyY2UueCArIFwiLFwiICsgc291cmNlLnkgKyBcIilcIjsgfSlcbiAgICAgIC5yZW1vdmUoKTtcbn1cbiIsIi8vIE1vZHVsZXNcbnZhciBVdGlsID0gcmVxdWlyZSgnLi91dGlsLmpzJyk7XG52YXIgTm9kZXMgPSByZXF1aXJlKCcuL25vZGVzLmpzJyk7XG52YXIgTGlua3MgPSByZXF1aXJlKCcuL2xpbmtzLmpzJyk7XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBNYWluIGZ1bmN0aW9uIGZvciByZW5kZXJpbmdcbmZ1bmN0aW9uIHJlbmRlcihwYWdlKSB7XG4gIHZhciBjb25maWcgPSBwYWdlLmNvbmZpZztcbiAgdmFyIHJvb3QgPSBwYWdlLnJvb3Q7XG4gIHZhciB0cmVlV2lkdGggPSBjb25maWcuZ2V0VHJlZVdpZHRoKCk7XG5cbiAgcm9vdC54MCA9IHRyZWVXaWR0aCAvIDI7XG5cdHJvb3QueTAgPSAwO1xuXG4gIGlmKHJvb3QuY2hpbGRyZW4pIHtcbiAgICByb290LmNoaWxkcmVuLmZvckVhY2goVXRpbC50b2dnbGVBbGwpO1xuICB9XG5cbiAgdXBkYXRlKHBhZ2UsIHJvb3QpO1xuXG59XG5leHBvcnRzLnJlbmRlciA9IHJlbmRlcjtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIEZ1bmN0aW9ucyBmb3IgcHJvY2Vzc2luZyBsaW5rcyBsaXN0XG5mdW5jdGlvbiB1cGRhdGUocGFnZSwgc291cmNlKSB7XG4gIHZhciBjb25maWcgPSBwYWdlLmNvbmZpZztcbiAgdmFyIGR1cmF0aW9uID0gY29uZmlnLmdldFRyYW5zaXRpb25EdXJhdGlvbigpO1xuICB2YXIgbGlua0hlaWdodCA9IGNvbmZpZy5nZXRMaW5rSGVpZ2h0KCk7XG4gIHZhciB0cmVlTGF5b3V0ID0gcGFnZS50cmVlTGF5b3V0O1xuICB2YXIgdHJlZURhdGEgPSBwYWdlLnJvb3Q7XG4gIHZhciBub2Rlc0xpc3QgPSBjYWxjdWxhdGVOb2Rlc0xpc3QocGFnZSk7XG5cbiAgLy8gVXBkYXRlIG5vZGVzXG4gIE5vZGVzLnVwZGF0ZU5vZGVzKHBhZ2UsIHNvdXJjZSwgbm9kZXNMaXN0KTtcblxuICAvLyBVcGRhdGUgbGlua3NcbiAgTGlua3MudXBkYXRlTGlua3MocGFnZSwgc291cmNlLCBub2Rlc0xpc3QpO1xuXG4gIC8vIGNvbXB1dGUgdGhlIG5ldyB0cmVlIGhlaWdodFxuXG4gIFV0aWwudXBkYXRlVHJlZURpYWdyYW1IZWlnaHQocGFnZSk7XG5cbiAgLy8gU3Rhc2ggdGhlIG9sZCBwb3NpdGlvbnMgZm9yIHRyYW5zaXRpb24uXG4gIG5vZGVzTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGQpIHtcbiAgICBkLngwID0gZC54O1xuICAgIGQueTAgPSBkLnk7XG4gIH0pO1xufVxuZXhwb3J0cy51cGRhdGUgPSB1cGRhdGU7XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBGdW5jdGlvbiBmb3IgY2FsY3VsYXRpbmcgbm9kZXMgbGlzdCBwb3NpdGlvbiB1c2luZyBkMyBhcGlcbmZ1bmN0aW9uIGNhbGN1bGF0ZU5vZGVzTGlzdChwYWdlKSB7XG4gIHZhciBjb25maWcgPSBwYWdlLmNvbmZpZztcbiAgdmFyIGxpbmtIZWlnaHQgPSBjb25maWcuZ2V0TGlua0hlaWdodCgpO1xuICB2YXIgdHJlZURhdGEgPSBwYWdlLnJvb3Q7XG4gIHZhciB0cmVlTGF5b3V0ID0gcGFnZS50cmVlTGF5b3V0O1xuICB2YXIgbm9kZXNMaXN0O1xuXG4gIG5vZGVzTGlzdCA9IHRyZWVMYXlvdXQubm9kZXModHJlZURhdGEpLnJldmVyc2UoKTtcbiAgbm9kZXNMaXN0LmZvckVhY2goZnVuY3Rpb24oZCl7XG4gICAgZC55ID0gZC5kZXB0aCAqIGxpbmtIZWlnaHQ7XG4gICAgZC55ICs9IDgwO1xuICB9KTtcblxuICByZXR1cm4gbm9kZXNMaXN0O1xufVxuIiwidmFyIGpxdWVyeSA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIHEgPSByZXF1aXJlKCdxJyk7XG5cbi8vIEdldCB0cmVlIGRhdGFcbi8vIFJldHVybnMgYSBwcm9taXNlXG5mdW5jdGlvbiBnZXRUcmVlRGF0YShwYWdlKSB7XG4gIHZhciBjb25maWcgPSBwYWdlLmNvbmZpZztcbiAgdmFyIHJvb3RJZCA9IGNvbmZpZy5nZXRQZXJzb25JZCgpO1xuICB2YXIgdHJlZURlcHRoID0gY29uZmlnLmdldFRyZWVEZXB0aCgpO1xuICB2YXIgdXJsID0gXCIvdHJlZS9kYXRhXCI7XG5cbiAgcmV0dXJuIHEuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIGpxdWVyeS5hamF4KHtcbiAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgZGF0YToge1xuICAgICAgICBwZXJzb25JZDogcm9vdElkLFxuICAgICAgICBkZXB0aDogdHJlZURlcHRoXG4gICAgICB9LFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHBhZ2Uucm9vdCA9IGRhdGE7XG4gICAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuZXhwb3J0cy5nZXRUcmVlRGF0YSA9IGdldFRyZWVEYXRhO1xuIiwiLy8gTGlic1xudmFyIGQzID0gcmVxdWlyZSgnZDMnKTtcbnZhciBqcXVlcnkgPSByZXF1aXJlKCdqcXVlcnknKTtcblxuLy8gQ29tcG9uZW50c1xudmFyIHRyZWVDb250YWluZXIgPSBqcXVlcnkoJyNqcy10cmVlLWNvbnRhaW5lcicpO1xuXG4vLyBUb2dnbGUgY2hpbGRyZW5cbmZ1bmN0aW9uIHRvZ2dsZUFsbChkKSB7XG4gIGlmIChkLmNoaWxkcmVuKSB7XG4gICAgZC5jaGlsZHJlbi5mb3JFYWNoKHRvZ2dsZUFsbCk7XG4gICAgdG9nZ2xlKGQpO1xuICB9XG59XG5leHBvcnRzLnRvZ2dsZUFsbCA9IHRvZ2dsZUFsbDtcblxuZnVuY3Rpb24gdG9nZ2xlKGQpIHtcbiAgaWYgKGQuY2hpbGRyZW4pIHtcbiAgICBkLl9jaGlsZHJlbiA9IGQuY2hpbGRyZW47XG4gICAgZC5jaGlsZHJlbiA9IG51bGw7XG4gIH0gZWxzZSB7XG4gICAgZC5jaGlsZHJlbiA9IGQuX2NoaWxkcmVuO1xuICAgIGQuX2NoaWxkcmVuID0gbnVsbDtcbiAgfVxufVxuZXhwb3J0cy50b2dnbGUgPSB0b2dnbGU7XG5cbmZ1bmN0aW9uIGZpbmRNYXhEZXB0aChyb290KSB7XG4gIHZhciBjdXJyZW50TWF4RGVwdGggPSAwO1xuICBmaW5kTWF4RGVwdGhSZWN1cnNpdmUocm9vdCk7XG5cbiAgZnVuY3Rpb24gZmluZE1heERlcHRoUmVjdXJzaXZlKHBhcmVudCkge1xuICAgIGlmKHBhcmVudC5jaGlsZHJlbiAmJiBwYXJlbnQuY2hpbGRyZW4ubGVuZ3RoID4gMCl7XG5cdFx0XHRwYXJlbnQuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihkKXtcblx0XHRcdFx0ZmluZE1heERlcHRoUmVjdXJzaXZlKGQpO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIGlmKHBhcmVudC5kZXB0aCA+IGN1cnJlbnRNYXhEZXB0aCl7XG5cdFx0XHRjdXJyZW50TWF4RGVwdGggPSBwYXJlbnQuZGVwdGg7XG5cdFx0fVxuICB9XG5cbiAgcmV0dXJuIGN1cnJlbnRNYXhEZXB0aDtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVHJlZURpYWdyYW1IZWlnaHQocGFnZSkge1xuICAvLyBjYWxjdWxhdGUgbmV3IGhlaWdodFxuICB2YXIgY29uZmlnID0gcGFnZS5jb25maWc7XG4gIHZhciBsaW5rSGVpZ2h0ID0gY29uZmlnLmdldExpbmtIZWlnaHQoKTtcbiAgdmFyIG1heERlcHRoID0gZmluZE1heERlcHRoKHBhZ2Uucm9vdCk7XG5cdHZhciBuZXdIZWlnaHQgPSAobWF4RGVwdGggKiBsaW5rSGVpZ2h0KSArIDEwMDtcbiAgdmFyIGR1cmF0aW9uID0gY29uZmlnLmdldFRyYW5zaXRpb25EdXJhdGlvbigpICsgMTAwO1xuXG4gIC8vIHVwZGF0ZSB0aGUgZGlzcGxheSBoZWlnaHRcbiAgdmFyIHJvb3RTdmcgPSBwYWdlLnJvb3RTdmc7XG4gIHJvb3RTdmcudHJhbnNpdGlvbigpLmR1cmF0aW9uKGR1cmF0aW9uKVxuICAgIC5hdHRyKCdoZWlnaHQnLCBuZXdIZWlnaHQpO1xuICB0cmVlQ29udGFpbmVyLmFuaW1hdGUoe1xuICAgIGhlaWdodDogbmV3SGVpZ2h0XG4gIH0sIGR1cmF0aW9uKTtcblxuICAvLyBhZGQgdG8gdGhlIGNvbmZpZ1xuICBjb25maWcuc2V0VHJlZUhlaWdodChuZXdIZWlnaHQpO1xufVxuZXhwb3J0cy51cGRhdGVUcmVlRGlhZ3JhbUhlaWdodCA9IHVwZGF0ZVRyZWVEaWFncmFtSGVpZ2h0O1xuIl19
