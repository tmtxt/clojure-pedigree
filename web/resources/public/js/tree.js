(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Tree = require('./tree/main.js');
Tree.startRender({
  showDetailModal: true
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVm9sdW1lcy90bXR4dC9Qcm9qZWN0cy9jbG9qdXJlLXBlZGlncmVlL2pzL3RyZWUuanMiLCIvVm9sdW1lcy90bXR4dC9Qcm9qZWN0cy9jbG9qdXJlLXBlZGlncmVlL2pzL3RyZWUvY29uZmlnLmpzIiwiL1ZvbHVtZXMvdG10eHQvUHJvamVjdHMvY2xvanVyZS1wZWRpZ3JlZS9qcy90cmVlL2RlcHRoLmpzIiwiL1ZvbHVtZXMvdG10eHQvUHJvamVjdHMvY2xvanVyZS1wZWRpZ3JlZS9qcy90cmVlL2luaXQuanMiLCIvVm9sdW1lcy90bXR4dC9Qcm9qZWN0cy9jbG9qdXJlLXBlZGlncmVlL2pzL3RyZWUvbGlua3MuanMiLCIvVm9sdW1lcy90bXR4dC9Qcm9qZWN0cy9jbG9qdXJlLXBlZGlncmVlL2pzL3RyZWUvbWFpbi5qcyIsIi9Wb2x1bWVzL3RtdHh0L1Byb2plY3RzL2Nsb2p1cmUtcGVkaWdyZWUvanMvdHJlZS9tYXJyaWFnZS5qcyIsIi9Wb2x1bWVzL3RtdHh0L1Byb2plY3RzL2Nsb2p1cmUtcGVkaWdyZWUvanMvdHJlZS9tb2RhbC5qc3giLCIvVm9sdW1lcy90bXR4dC9Qcm9qZWN0cy9jbG9qdXJlLXBlZGlncmVlL2pzL3RyZWUvbm9kZXMuanMiLCIvVm9sdW1lcy90bXR4dC9Qcm9qZWN0cy9jbG9qdXJlLXBlZGlncmVlL2pzL3RyZWUvcmVuZGVyLmpzIiwiL1ZvbHVtZXMvdG10eHQvUHJvamVjdHMvY2xvanVyZS1wZWRpZ3JlZS9qcy90cmVlL3JlcXVlc3QuanMiLCIvVm9sdW1lcy90bXR4dC9Qcm9qZWN0cy9jbG9qdXJlLXBlZGlncmVlL2pzL3RyZWUvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3JDLElBQUksQ0FBQyxX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QUMsS0FBSyxDQUFDO0dBQy9CO0FBQ0gsR0FBRzs7RUFFRCxPQUFPLGVBQWUsQ0FBQztBQUN6QixDQUFDOztBQUVELFNBQVMsdUJBQXVCLENBQUMsSUFBSSxFQUFFOztFQUVyQyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0VBQ3pCLElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztFQUN4QyxJQUFJLFFBQVEsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0NBQ3hDLElBQUksU0FBUyxHQUFHLENBQUMsUUFBUSxHQUFHLFVBQVUsSUFBSSxHQUFHLENBQUM7QUFDL0MsRUFBRSxJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMscUJBQXFCLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDdEQ7O0VBRUUsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztFQUMzQixPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztLQUNwQyxJQUFJLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0VBQzdCLGFBQWEsQ0FBQyxPQUFPLENBQUM7SUFDcEIsTUFBTSxFQUFFLFNBQVM7QUFDckIsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ2Y7O0VBRUUsTUFBTSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztDQUNqQztBQUNELE9BQU8sQ0FBQyx1QkFBdUIsR0FBRyx1QkFBdUIsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgVHJlZSA9IHJlcXVpcmUoJy4vdHJlZS9tYWluLmpzJyk7XG5UcmVlLnN0YXJ0UmVuZGVyKHtcbiAgc2hvd0RldGFpbE1vZGFsOiB0cnVlXG59KTtcbiIsIi8vIExpYnNcbnZhciBqcXVlcnkgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBkMyA9IHJlcXVpcmUoJ2QzJyk7XG5cbi8vIENvbmZpZ3VyYXRpb25cbnZhciBjb25maWcgPSB7fTtcblxuLy8gTGluayBoZWlnaHRcbmNvbmZpZy5saW5rSGVpZ2h0ID0gMjAwO1xuY29uZmlnLmdldExpbmtIZWlnaHQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMubGlua0hlaWdodDtcbn07XG5jb25maWcuc2V0TGlua0hlaWdodCA9IGZ1bmN0aW9uKHZhbCkge1xuICB0aGlzLmxpbmtIZWlnaHQgPSB2YWw7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gVHJlZSBjb250YWluZXIgaWRcbmNvbmZpZy5jb250YWluZXJJZCA9IFwiI2pzLXRyZWUtY29udGFpbmVyXCI7XG5jb25maWcuZ2V0Q29udGFpbmVySWQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuY29udGFpbmVySWQ7XG59O1xuXG4vLyBFbmFibGUgbWFycmlhZ2UgZGlzcGxheVxuY29uZmlnLmVuYWJsZU1hcnJpYWdlID0gZmFsc2U7XG5jb25maWcuZ2V0RW5hYmxlTWFycmlhZ2UgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZW5hYmxlTWFycmlhZ2U7XG59O1xuY29uZmlnLnNldEVuYWJsZU1hcnJpYWdlID0gZnVuY3Rpb24odmFsKSB7XG4gIHRoaXMuZW5hYmxlTWFycmlhZ2UgPSB2YWw7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gVHJlZSB3aWR0aFxuY29uZmlnLnRyZWVXaWR0aCA9IGpxdWVyeShjb25maWcuY29udGFpbmVySWQpLndpZHRoKCk7XG5jb25maWcuZ2V0VHJlZVdpZHRoID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnRyZWVXaWR0aDtcbn07XG5jb25maWcuc2V0VHJlZVdpZHRoID0gZnVuY3Rpb24odmFsKSB7XG4gIHRoaXMudHJlZVdpZHRoID0gdmFsO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIFRyZWUgaGVpZ2h0XG5jb25maWcudHJlZUhlaWdodCA9IDEwMDA7XG5jb25maWcuZ2V0VHJlZUhlaWdodCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy50cmVlSGVpZ2h0O1xufTtcbmNvbmZpZy5zZXRUcmVlSGVpZ2h0ID0gZnVuY3Rpb24odmFsKSB7XG4gIHRoaXMudHJlZUhlaWdodCA9IHZhbDtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBUcmFuc2l0aW9uIGR1cmF0aW9uXG5jb25maWcuZ2V0VHJhbnNpdGlvbkR1cmF0aW9uID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBkMy5ldmVudCAmJiBkMy5ldmVudC5hbHRLZXkgPyA1MDAwIDogNTAwO1xufTtcblxuLy8gQWxsb3cgc2hvdyBtb2RhbCBvbiBjbGlja1xuY29uZmlnLnNob3dEZXRhaWxNb2RhbCA9IHRydWU7XG5jb25maWcuZ2V0U2hvd0RldGFpbE1vZGFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnNob3dEZXRhaWxNb2RhbDtcbn07XG5jb25maWcuc2V0U2hvd0RldGFpbE1vZGFsID0gZnVuY3Rpb24odmFsKSB7XG4gIHRoaXMuc2hvd0RldGFpbE1vZGFsID0gdmFsO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIElzIGF1dGhlbnRpY2F0ZWQ/XG5jb25maWcuaXNBdXRoZW50aWNhdGVkID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpc0F1dGhlbnRpY2F0ZWQgPSB3aW5kb3cuaXNBdXRoZW50aWNhdGVkIHx8IGZhbHNlO1xuICByZXR1cm4gaXNBdXRoZW50aWNhdGVkO1xufTtcblxuLy8gUm9vdCBwZXJzb24gaWRcbmNvbmZpZy5wZXJzb25JZCA9IHdpbmRvdy5wZXJzb25JZDtcbmNvbmZpZy5nZXRQZXJzb25JZCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5wZXJzb25JZDtcbn07XG5cbi8vIFRyZWUgZGVwdGhcbmNvbmZpZy50cmVlRGVwdGggPSB3aW5kb3cudHJlZURlcHRoO1xuY29uZmlnLmdldFRyZWVEZXB0aCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy50cmVlRGVwdGg7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbmZpZztcbiIsIi8vIGxpYnNcbnZhciBqcXVlcnkgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBjb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZy5qcycpO1xuXG4vLyBlbGVtZW50c1xudmFyIHVwZGF0ZURlcHRoQnV0dG9uID0ganF1ZXJ5KCcuanMtdXBkYXRlLXRyZWUtZGVwdGgnKTtcbnZhciB0cmVlRGVwdGhJbnB1dCA9IGpxdWVyeSgnLmpzLXRyZWUtZGVwdGgtaW5wdXQnKTtcblxuLy8gaW5pdCB2YWx1ZSBmb3IgdHJlZSBkZXB0aCBpbnB1dFxudmFyIHRyZWVEZXB0aCA9IGNvbmZpZy5nZXRUcmVlRGVwdGgoKTtcbmlmICghIXRyZWVEZXB0aCkge1xuICB0cmVlRGVwdGhJbnB1dC52YWwodHJlZURlcHRoKTtcbn1cblxuLy8gb24gdXBkYXRlIGRlcHRoXG51cGRhdGVEZXB0aEJ1dHRvbi5jbGljayhmdW5jdGlvbigpe1xuICB2YXIgZGVwdGg7XG4gIGRlcHRoID0gdHJlZURlcHRoSW5wdXQudmFsKCk7XG4gIGRlcHRoID0gcGFyc2VJbnQoZGVwdGgpO1xuXG4gIHZhciBwZXJzb25JZCA9IGNvbmZpZy5nZXRQZXJzb25JZCgpO1xuXG4gIGlmICghaXNOYU4oZGVwdGgpKSB7XG4gICAgaWYgKCEhcGVyc29uSWQpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKCcvdHJlZS92aWV3L3BlcnNvbi8nICsgcGVyc29uSWQgKyAnL2RlcHRoLycgKyBkZXB0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKCcvdHJlZS92aWV3L2RlcHRoLycgKyBkZXB0aCk7XG4gICAgfVxuICB9XG59KTtcbiIsIi8vIEluaXRcbnZhciBxID0gcmVxdWlyZSgncScpO1xudmFyIGQzID0gcmVxdWlyZSgnZDMnKTtcblxuLy8gR2VuZXJhbCBpbml0IGZ1bmN0aW9uXG4vLyBSZXR1cm5zIGEgcHJvbWlzZSwgcmVzb2x2ZSB3aGVuIGZpbmlzaCBpbml0aWFsaXppbmdcbmZ1bmN0aW9uIGluaXQocGFnZSkge1xuICByZXR1cm4gcS5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpe1xuICAgIGluaXRMYXlvdXQocGFnZSk7ICAgICAgICAgICAvLyBJbml0IHRoZSBkMyB0cmVlIGxheW91dFxuICAgIGluaXRTdmcocGFnZSk7ICAgICAgICAgICAgICAvLyBJbml0IHRoZSByb290IHN2ZyB0YWcgZm9yIGhvbGRpbmcgb3RoZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZWxlbWVudHNcbiAgICByZXNvbHZlKCk7ICAgICAgICAgICAgICAgICAgLy8gRmluaXNoIHRoZSBwcm9taXNlXG4gIH0pO1xufVxuZXhwb3J0cy5pbml0ID0gaW5pdDtcblxuLy8gSW5pdCB0aGUgZDMgdHJlZSBsYXlvdXRcbmZ1bmN0aW9uIGluaXRMYXlvdXQocGFnZSkge1xuICB2YXIgY29uZmlnID0gcGFnZS5jb25maWc7XG4gIHZhciB0cmVlV2lkdGggPSBjb25maWcuZ2V0VHJlZVdpZHRoKCk7XG4gIHZhciB0cmVlSGVpZ2h0ID0gY29uZmlnLmdldFRyZWVIZWlnaHQoKTtcblxuICBwYWdlLnRyZWVMYXlvdXQgPSBkMy5sYXlvdXQudHJlZSgpLnNpemUoW3RyZWVXaWR0aCwgdHJlZUhlaWdodF0pO1xuICBwYWdlLmRpYWdvbmFsID0gZDMuc3ZnLmRpYWdvbmFsKCkucHJvamVjdGlvbihmdW5jdGlvbihkKSB7IHJldHVybiBbZC54LCBkLnldOyB9KTtcbn1cblxuLy8gaW5pdCB0aGUgU1ZHIGVsZW1lbnRzXG5mdW5jdGlvbiBpbml0U3ZnKHBhZ2UpIHtcbiAgdmFyIGNvbmZpZyA9IHBhZ2UuY29uZmlnO1xuICB2YXIgY29udGFpbmVySWQgPSBjb25maWcuZ2V0Q29udGFpbmVySWQoKTtcbiAgdmFyIHRyZWVXaWR0aCA9IGNvbmZpZy5nZXRUcmVlV2lkdGgoKTtcbiAgdmFyIHRyZWVIZWlnaHQgPSBjb25maWcuZ2V0VHJlZUhlaWdodCgpO1xuXG4gIC8vIFNWRyByb290LCBmb3IgaG9sZGluZyBhbGwgdGhlIHRyZWUgZWxlbWVudHNcbiAgcGFnZS5yb290U3ZnID0gZDMuc2VsZWN0KGNvbnRhaW5lcklkKS5hcHBlbmQoXCJzdmc6c3ZnXCIpXG4gICAgLmF0dHIoXCJ3aWR0aFwiLCB0cmVlV2lkdGgpXG4gICAgLmF0dHIoXCJoZWlnaHRcIiwgdHJlZUhlaWdodCk7XG5cbiAgLy8gU3ZnIHJvb3QgZ3JvdXBcbiAgcGFnZS5yb290R3JvdXAgPSBwYWdlLnJvb3RTdmcuYXBwZW5kKFwic3ZnOmdcIilcbiAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIDAgKyBcIixcIiArIDAgKyBcIilcIik7XG59XG4iLCJmdW5jdGlvbiB1cGRhdGVMaW5rcyhwYWdlLCBzb3VyY2UsIG5vZGVzTGlzdCkge1xuICB2YXIgY29uZmlnID0gcGFnZS5jb25maWc7XG4gIHZhciBkdXJhdGlvbiA9IGNvbmZpZy5nZXRUcmFuc2l0aW9uRHVyYXRpb24oKTtcblxuICAvLyBCaW5kIGRhdGEgdG8gdGhlIGxpbmtzIChub3QgYWN0dWFsbHkgY3JlYXRlIHRoZSBlbGVtZW50cylcbiAgdmFyIGxpbmtzR3JvdXAgPSBwYWdlLnJvb3RHcm91cC5zZWxlY3RBbGwoXCJwYXRoLmxpbmtcIilcbiAgICAgIC5kYXRhKHBhZ2UudHJlZUxheW91dC5saW5rcyhub2Rlc0xpc3QpLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLnRhcmdldC5pZDsgfSk7XG5cbiAgZW50ZXIocGFnZSwgc291cmNlLCBsaW5rc0dyb3VwKTtcbiAgdXBkYXRlKHBhZ2UsIHNvdXJjZSwgbGlua3NHcm91cCk7XG4gIGV4aXQocGFnZSwgc291cmNlLCBsaW5rc0dyb3VwKTtcblxufVxuZXhwb3J0cy51cGRhdGVMaW5rcyA9IHVwZGF0ZUxpbmtzO1xuXG5mdW5jdGlvbiBlbnRlcihwYWdlLCBzb3VyY2UsIGxpbmtzR3JvdXApIHtcbiAgdmFyIGNvbmZpZyA9IHBhZ2UuY29uZmlnO1xuICB2YXIgZHVyYXRpb24gPSBjb25maWcuZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCk7XG5cbiAgLy8gY3JlYXRlIG1pc3NpbmcgbGlua3MgaWYgbmVjZXNzYXJ5XG4gIGxpbmtzR3JvdXAuZW50ZXIoKS5pbnNlcnQoXCJzdmc6cGF0aFwiLCBcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIFwibGlua1wiKVxuICAgIC5hdHRyKFwiZFwiLCBmdW5jdGlvbihkKSB7XG4gICAgICB2YXIgbyA9IHt4OiBzb3VyY2UueDAsIHk6IHNvdXJjZS55MH07XG4gICAgICByZXR1cm4gcGFnZS5kaWFnb25hbCh7c291cmNlOiBvLCB0YXJnZXQ6IG99KTtcbiAgICB9KVxuICAgIC50cmFuc2l0aW9uKClcbiAgICAuZHVyYXRpb24oZHVyYXRpb24pXG4gICAgLmF0dHIoXCJkXCIsIHBhZ2UuZGlhZ29uYWwpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGUocGFnZSwgc291cmNlLCBsaW5rc0dyb3VwKSB7XG4gIHZhciBjb25maWcgPSBwYWdlLmNvbmZpZztcbiAgdmFyIGR1cmF0aW9uID0gY29uZmlnLmdldFRyYW5zaXRpb25EdXJhdGlvbigpO1xuXG4gIC8vIHRyYW5zaXRpb24gbGlua3NcbiAgbGlua3NHcm91cC50cmFuc2l0aW9uKClcbiAgICAuZHVyYXRpb24oZHVyYXRpb24pXG4gICAgLmF0dHIoXCJkXCIsIHBhZ2UuZGlhZ29uYWwpO1xufVxuXG5mdW5jdGlvbiBleGl0KHBhZ2UsIHNvdXJjZSwgbGlua3NHcm91cCkge1xuICB2YXIgY29uZmlnID0gcGFnZS5jb25maWc7XG4gIHZhciBkdXJhdGlvbiA9IGNvbmZpZy5nZXRUcmFuc2l0aW9uRHVyYXRpb24oKTtcblxuICAvLyByZW1vdmUgdW4tdXNlZCBsaW5rc1xuICBsaW5rc0dyb3VwLmV4aXQoKS50cmFuc2l0aW9uKClcbiAgICAuZHVyYXRpb24oZHVyYXRpb24pXG4gICAgLmF0dHIoXCJkXCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgIHZhciBvID0ge3g6IHNvdXJjZS54LCB5OiBzb3VyY2UueX07XG4gICAgICByZXR1cm4gcGFnZS5kaWFnb25hbCh7c291cmNlOiBvLCB0YXJnZXQ6IG99KTtcbiAgICB9KVxuICAgIC5yZW1vdmUoKTtcbn1cbiIsInZhciBSZXF1ZXN0ID0gcmVxdWlyZSgnLi9yZXF1ZXN0LmpzJyk7XG52YXIgQ29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcuanMnKTtcbnZhciBJbml0ID0gcmVxdWlyZSgnLi9pbml0LmpzJyk7XG52YXIgUmVuZGVyID0gcmVxdWlyZSgnLi9yZW5kZXIuanMnKTtcbnZhciBNYXJyaWFnZSA9IHJlcXVpcmUoJy4vbWFycmlhZ2UuanMnKTtcbnZhciBEZXB0aCA9IHJlcXVpcmUoJy4vZGVwdGguanMnKTtcblxuLy8gR2xvYmFsIHBhZ2Ugb2JqZWN0XG52YXIgcGFnZSA9IHtcbiAgY29uZmlnOiBudWxsLFxuICB0cmVlTGF5b3V0OiBudWxsLFxuICBkaWFnb25hbDogbnVsbCxcbiAgcm9vdFN2ZzogbnVsbCxcbiAgdHJlZURhdGE6IG51bGxcbn07XG5wYWdlLmNvbmZpZyA9IENvbmZpZztcblxuLy8gT3B0aW9ucyB0byBDb25maWdcbmZ1bmN0aW9uIHNldENvbmZpZyhvcHRzKSB7XG4gIHZhciBjb25maWcgPSBwYWdlLmNvbmZpZztcblxuICAvLyBvcHRpb25zXG4gIG9wdHMgPSBvcHRzIHx8IHt9O1xuXG4gIC8vIHNob3cgZGV0YWlsIG1vZGFsXG4gIHZhciBzaG93RGV0YWlsTW9kYWwgPSBvcHRzLnNob3dEZXRhaWxNb2RhbCB8fCBmYWxzZTtcbiAgY29uZmlnLnNldFNob3dEZXRhaWxNb2RhbChzaG93RGV0YWlsTW9kYWwpO1xuXG4gIC8vIGxpbmsgaGVpZ2h0XG4gIHZhciBsaW5rSGVpZ2h0ID0gb3B0cy5saW5rSGVpZ2h0IHx8IGNvbmZpZy5nZXRMaW5rSGVpZ2h0KCk7XG4gIGNvbmZpZy5zZXRMaW5rSGVpZ2h0KGxpbmtIZWlnaHQpO1xufVxuXG4vLyBTdGFydCB0aGUgcmVuZGVyaW5nXG5mdW5jdGlvbiBzdGFydFJlbmRlcihvcHRzKSB7XG4gIC8vIHRyYW5zZm9ybSBvcHRpb25zIHRvIGNvbmZpZ1xuICBzZXRDb25maWcob3B0cyk7XG5cbiAgLy8gc3RhcnQgdGhlIHByb2Nlc3NcbiAgTWFycmlhZ2UuaW5pdChwYWdlKTtcbiAgSW5pdC5pbml0KHBhZ2UpXG4gICAgLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiBSZXF1ZXN0LmdldFRyZWVEYXRhKHBhZ2UpO1xuICAgIH0pXG4gICAgLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiBSZW5kZXIucmVuZGVyKHBhZ2UpO1xuICAgIH0sIGZ1bmN0aW9uKGUpe1xuICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgfSk7XG59XG5leHBvcnRzLnN0YXJ0UmVuZGVyID0gc3RhcnRSZW5kZXI7XG4iLCIvLyBMaWJzXG52YXIganF1ZXJ5ID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgXyA9IHJlcXVpcmUoJ18nKTtcbnZhciBkMyA9IHJlcXVpcmUoJ2QzJyk7XG5cbi8vIE1vZHVsZXNcbnZhciBNb2RhbCA9IHJlcXVpcmUoJy4vbW9kYWwuanN4Jyk7XG5cbi8vIENvbXBvbmVudHNcbnZhciBtYXJyaWFnZUNoZWNrYm94ID0ganF1ZXJ5KCcuanMtdG9nZ2xlLW1hcnJpYWdlJyk7XG5cbi8vIEluaXQgdGhpcyBtb2R1bGVcbmZ1bmN0aW9uIGluaXQocGFnZSkge1xuICBtYXJyaWFnZUNoZWNrYm94LmNoYW5nZShmdW5jdGlvbigpe1xuICAgIGlmKG1hcnJpYWdlQ2hlY2tib3guaXMoJzpjaGVja2VkJykpIHtcbiAgICAgIGVuYWJsZU1hcnJpYWdlKHBhZ2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkaXNhYmxlTWFycmlhZ2UocGFnZSk7XG4gICAgfVxuICB9KTtcbn1cbmV4cG9ydHMuaW5pdCA9IGluaXQ7XG5cbmZ1bmN0aW9uIGNyZWF0ZU1hcnJpYWdlTm9kZShwYWdlLCBub2RlLCBkYXRhKSB7XG4gIHJldHVybiBkMy5zZWxlY3Qobm9kZSkuYXBwZW5kKFwic3ZnOmltYWdlXCIpXG4gICAgLmF0dHIoXCJ4bGluazpocmVmXCIsIGRhdGEucGljdHVyZSlcbiAgICAuYXR0cihcImNsYXNzXCIsIFwibWFycmlhZ2UtaW1hZ2VcIilcbiAgICAuYXR0cihcInhcIiwgLTIwKVxuICAgIC5hdHRyKFwieVwiLCAtNjgpXG4gICAgLmF0dHIoXCJoZWlnaHRcIiwgXCI0MHB4XCIpXG4gICAgLmF0dHIoXCJ3aWR0aFwiLCBcIjQwcHhcIilcbiAgICAuZGF0dW0oZGF0YSlcbiAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24oZCl7XG4gICAgICBNb2RhbC5zaG93UGVyc29uSW5mbyhwYWdlLCBkKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gZW5hYmxlTWFycmlhZ2UocGFnZSkge1xuICB2YXIgY29uZmlnID0gcGFnZS5jb25maWc7XG4gIHZhciBkdXJhdGlvbiA9IGNvbmZpZy5nZXRUcmFuc2l0aW9uRHVyYXRpb24oKTtcbiAgY29uZmlnLnNldEVuYWJsZU1hcnJpYWdlKHRydWUpO1xuXG4gIC8vIGdldCBhbGwgdmlzaWJsZSBub2Rlc1xuICB2YXIgbm9kZXMgPSBkMy5zZWxlY3RBbGwoJ2cubm9kZScpWzBdO1xuXG4gIC8vIGxvb3BcbiAgbm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKSB7XG4gICAgdmFyIG9yZGVyID0gMDtcbiAgICBfLmVhY2gobm9kZS5fX2RhdGFfXy5tYXJyaWFnZSwgZnVuY3Rpb24obWFycmlhZ2UpIHtcbiAgICAgIHZhciBtYXJyaWFnZU5vZGUgPSBjcmVhdGVNYXJyaWFnZU5vZGUocGFnZSwgbm9kZSwgbWFycmlhZ2UpO1xuICAgICAgbWFycmlhZ2VOb2RlXG4gICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgLmR1cmF0aW9uKGR1cmF0aW9uKVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSAoJyArICgoNDUgKiBvcmRlcikgKyA0NSkgKyAnLDApJyk7XG4gICAgICBvcmRlciA9IG9yZGVyICsgMTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGRpc2FibGVNYXJyaWFnZShwYWdlKSB7XG4gIHZhciBjb25maWcgPSBwYWdlLmNvbmZpZztcbiAgdmFyIGR1cmF0aW9uID0gY29uZmlnLmdldFRyYW5zaXRpb25EdXJhdGlvbigpO1xuICBjb25maWcuc2V0RW5hYmxlTWFycmlhZ2UoZmFsc2UpO1xuXG4gIC8vIHJlbW92ZSBhbGwgbWFycmlhZ2UgaW1hZ2VzXG4gIGQzLnNlbGVjdEFsbCgnaW1hZ2UubWFycmlhZ2UtaW1hZ2UnKVxuICAgIC50cmFuc2l0aW9uKClcbiAgICAuZHVyYXRpb24oZHVyYXRpb24pXG4gICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCwwKVwiKVxuICAgIC5yZW1vdmUoKTtcbn1cblxuZnVuY3Rpb24gYXBwZW5kTWFycmlhZ2VzKHBhZ2UsIG5vZGVFbnRlcikge1xuICB2YXIgY29uZmlnID0gcGFnZS5jb25maWc7XG4gIHZhciBlbmFibGVNYXJyaWFnZSA9IGNvbmZpZy5nZXRFbmFibGVNYXJyaWFnZSgpO1xuXG4gIGlmKGVuYWJsZU1hcnJpYWdlKSB7XG4gICAgXy5lYWNoKG5vZGVFbnRlclswXSwgZnVuY3Rpb24obm9kZSl7XG4gICAgICBpZighIW5vZGUpIHtcbiAgICAgICAgdmFyIG9yZGVyID0gMDtcbiAgICAgICAgXy5lYWNoKG5vZGUuX19kYXRhX18ubWFycmlhZ2UsIGZ1bmN0aW9uKG1hcnJpYWdlKXtcbiAgICAgICAgICB2YXIgbWFycmlhZ2VOb2RlID0gY3JlYXRlTWFycmlhZ2VOb2RlKHBhZ2UsIG5vZGUsIG1hcnJpYWdlKTtcbiAgICAgICAgICBtYXJyaWFnZU5vZGVcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5kdXJhdGlvbigwKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUgKCcgKyAoKDQ1ICogb3JkZXIpICsgNDUpICsgJywwKScpO1xuICAgICAgICAgIG9yZGVyID0gb3JkZXIgKyAxO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuZXhwb3J0cy5hcHBlbmRNYXJyaWFnZXMgPSBhcHBlbmRNYXJyaWFnZXM7XG4iLCIvLyBMaWJzXG52YXIgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG52YXIganF1ZXJ5ID0gcmVxdWlyZShcImpxdWVyeVwiKTtcblxuLy8gTW9kYWwgb2JqZWN0XG52YXIgUGVyc29uTW9kYWwgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwgZmFkZSBwZXJzb24taW5mby1tb2RhbCBqcy1wZXJzb24taW5mby1tb2RhbFwiIHRhYkluZGV4PVwiLTFcIiByb2xlPVwiZGlhbG9nXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtZGlhbG9nXCIgcm9sZT1cImRvY3VtZW50XCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1jb250ZW50XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWhlYWRlclwiPlxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+PHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj48L2J1dHRvbj5cbiAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cIm1vZGFsLXRpdGxlXCIgaWQ9XCJteU1vZGFsTGFiZWxcIj5cbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wc1tcImZ1bGwtbmFtZVwiXX1cbiAgICAgICAgICAgICAgPC9oND5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1ib2R5XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGVyc29uLWluZm8tbGVmdFwiPlxuICAgICAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiaW1nLXJlc3BvbnNpdmVcIiBhbHQ9XCJcIiBzcmM9e3RoaXMucHJvcHMucGljdHVyZX0vPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwZXJzb24taW5mby1yaWdodFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGVyc29uLWluZm8tcm93XCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBlcnNvbi1pbmZvLWZpZWxkXCI+XG4gICAgICAgICAgICAgICAgICAgIEjhu40gdMOqblxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBlcnNvbi1pbmZvLXZhbHVlXCI+XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzW1wiZnVsbC1uYW1lXCJdfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwZXJzb24taW5mby1yb3dcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGVyc29uLWluZm8tZmllbGRcIj5cbiAgICAgICAgICAgICAgICAgICAgTmfDoHkgU2luaFxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBlcnNvbi1pbmZvLXZhbHVlXCI+XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzW1wiYmlydGgtZGF0ZVwiXSA/IHRoaXMucHJvcHNbXCJiaXJ0aC1kYXRlXCJdIDogXCJLaMO0bmcgcsO1XCJ9XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBlcnNvbi1pbmZvLXJvd1wiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwZXJzb24taW5mby1maWVsZFwiPlxuICAgICAgICAgICAgICAgICAgICBUw6xuaCB0cuG6oW5nXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGVyc29uLWluZm8tdmFsdWVcIj5cbiAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHNbXCJhbGl2ZS1zdGF0dXNcIl19XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICAgIDxhIGhyZWY9e1wiL3BlcnNvbi9kZXRhaWwvXCIgKyB0aGlzLnByb3BzLmlkfSBjbGFzc05hbWU9XCJidG4gYnRuLXN1Y2Nlc3NcIj5DaGkgdGnhur90PC9hPlxuICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5pc0F1dGhlbnRpY2F0ZWQgPyA8YSBocmVmPXtcIi9wZXJzb24vYWRkL2NoaWxkSWQvXCIgKyB0aGlzLnByb3BzLmlkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIj5UaMOqbSBDaGEgTeG6uTwvYT5cbiAgICAgICAgICAgICAgIDogbnVsbCB9XG4gICAgICAgICAgICAgIHt0aGlzLnByb3BzLmlzQXV0aGVudGljYXRlZCA/IDxhIGhyZWY9e1wiL3BlcnNvbi9hZGQvcGFydG5lcklkL1wiICsgdGhpcy5wcm9wcy5pZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCI+VGjDqm0gduG7oyBjaOG7k25nPC9hPlxuICAgICAgICAgICAgICAgOiBudWxsIH1cbiAgICAgICAgICAgICAge3RoaXMucHJvcHMuaXNBdXRoZW50aWNhdGVkID8gPGEgaHJlZj17XCIvcGVyc29uL2FkZC9wYXJlbnRJZC9cIiArIHRoaXMucHJvcHMuaWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiPlRow6ptIGNvbjwvYT5cbiAgICAgICAgICAgICAgIDogbnVsbCB9XG4gICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+xJDDs25nPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59KTtcblxuLy8gUmVuZGVyIGZ1bmN0aW9uXG5mdW5jdGlvbiBzaG93UGVyc29uSW5mbyhwYWdlLCBpbmZvKSB7XG4gIC8vIGlzIGF1dGhlbnRpY2F0ZWQ/XG4gIGluZm8uaXNBdXRoZW50aWNhdGVkID0gcGFnZS5jb25maWcuaXNBdXRoZW50aWNhdGVkKCk7XG5cbiAgLy8gdW5tb3VudCBmaXJzdFxuICBSZWFjdC51bm1vdW50Q29tcG9uZW50QXROb2RlKFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwianMtdXNlci1tb2RhbC1jb250YWluZXJcIilcbiAgKTtcblxuICAvLyByZW5kZXIgZG9tXG4gIFJlYWN0LnJlbmRlcihcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFBlcnNvbk1vZGFsLCBpbmZvKSxcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpzLXVzZXItbW9kYWwtY29udGFpbmVyXCIpXG4gICk7XG5cbiAgLy8gc2hvdyBtb2RhbFxuICBqcXVlcnkoXCIuanMtcGVyc29uLWluZm8tbW9kYWxcIikubW9kYWwoKTtcbn1cbmV4cG9ydHMuc2hvd1BlcnNvbkluZm8gPSBzaG93UGVyc29uSW5mbztcbiIsIi8vIExpYnNcbnZhciBfID0gcmVxdWlyZSgnXycpO1xudmFyIGQzID0gcmVxdWlyZSgnZDMnKTtcblxuLy8gTW9kdWxlc1xudmFyIFJlbmRlciA9IHJlcXVpcmUoJy4vcmVuZGVyLmpzJyk7XG52YXIgVXRpbCA9IHJlcXVpcmUoJy4vdXRpbC5qcycpO1xudmFyIE1hcnJpYWdlID0gcmVxdWlyZSgnLi9tYXJyaWFnZScpO1xudmFyIE1vZGFsID0gcmVxdWlyZSgnLi9tb2RhbC5qc3gnKTtcblxuLy8gVmFyaWFibGVzXG52YXIgaWQgPSAwO1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gRnVuY3Rpb25zIGZvciBwcm9jZXNzaW5nIHRoZSB0cmVlIG5vZGVzXG5mdW5jdGlvbiB1cGRhdGVOb2RlcyhwYWdlLCBzb3VyY2UsIG5vZGVzTGlzdCkge1xuICB2YXIgdHJlZUxheW91dCA9IHBhZ2UudHJlZUxheW91dDtcbiAgdmFyIHRyZWVEYXRhID0gcGFnZS5yb290O1xuXG4gIC8vIEJpbmQgZGF0YSB0byB0aGUgc3ZnIG5vZGVzIChub3QgYWN0dWFsIG5vZGVzIG5vdylcbiAgdmFyIG5vZGVHcm91cHMgPSBwYWdlLnJvb3RHcm91cC5zZWxlY3RBbGwoXCJnLm5vZGVcIilcbiAgICAgIC5kYXRhKG5vZGVzTGlzdCwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pZCB8fCAoZC5pZCA9ICsraWQpOyB9KTtcblxuICBlbnRlcihwYWdlLCBzb3VyY2UsIG5vZGVHcm91cHMpO1xuICB1cGRhdGUocGFnZSwgc291cmNlLCBub2RlR3JvdXBzKTtcbiAgZXhpdChwYWdlLCBzb3VyY2UsIG5vZGVHcm91cHMpO1xufVxuZXhwb3J0cy51cGRhdGVOb2RlcyA9IHVwZGF0ZU5vZGVzO1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gRW50ZXJcbmZ1bmN0aW9uIGVudGVyKHBhZ2UsIHNvdXJjZSwgbm9kZUdyb3Vwcykge1xuICAvLyBOb3cgYWN0dWFsbHkgY3JlYXRlIG5ldyBub2RlIGdyb3VwIGlmIG5vdCBleGlzdFxuICB2YXIgbm9kZUVudGVyID0gbm9kZUdyb3Vwcy5lbnRlcigpLmFwcGVuZChcInN2ZzpnXCIpXG4gICAgICAuYXR0cihcImNsYXNzXCIsIFwibm9kZVwiKVxuICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyBzb3VyY2UueDAgKyBcIixcIiArIHNvdXJjZS55MCArIFwiKVwiOyB9KTtcbiAgLy8gQ3JlYXRlIHRoZSBlbGVtZW50cyBpbnNpZGUgdGhhdCBub2RlIGdyb3VwXG4gIGFwcGVuZENpcmNsZXMocGFnZSwgbm9kZUVudGVyKTtcbiAgYXBwZW5kTmFtZXMocGFnZSwgbm9kZUVudGVyKTtcbiAgYXBwZW5kSW1hZ2VzKHBhZ2UsIG5vZGVFbnRlcik7XG4gIE1hcnJpYWdlLmFwcGVuZE1hcnJpYWdlcyhwYWdlLCBub2RlRW50ZXIpO1xufVxuXG5mdW5jdGlvbiBhcHBlbmRDaXJjbGVzKHBhZ2UsIG5vZGVFbnRlcikge1xuICAvLyBUaGUgY2lyY2xlIHRvIGNsaWNrIGZvciBleHBhbmRpbmdcbiAgbm9kZUVudGVyLmFwcGVuZChcInN2ZzpjaXJjbGVcIilcblx0XHQub24oXCJjbGlja1wiLCBmdW5jdGlvbihkKSB7XG4gICAgICBVdGlsLnRvZ2dsZShkKTtcbiAgICAgIFJlbmRlci51cGRhdGUocGFnZSwgZCk7IC8vIFVwZGF0ZSB0aGUgdHJlZSBhZ2FpblxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBhcHBlbmROYW1lcyhwYWdlLCBub2RlRW50ZXIpIHtcbiAgLy8gUGVyc29uIG5hbWVcbiAgbm9kZUVudGVyLmFwcGVuZChcInN2Zzp0ZXh0XCIpXG4gICAgLnRleHQoZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pbmZvW1wiZnVsbC1uYW1lXCJdOyB9KVxuICAgIC5hdHRyKFwieVwiLCAtMTkpXG4gICAgLmF0dHIoXCJkeVwiLCBcIi4zNWVtXCIpXG4gICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxuICAgIC5zdHlsZShcImZpbGwtb3BhY2l0eVwiLCAxKTtcbn1cblxuZnVuY3Rpb24gYXBwZW5kSW1hZ2VzKHBhZ2UsIG5vZGVFbnRlcikge1xuICAvLyBQZXJzb24gaW1hZ2VcbiAgbm9kZUVudGVyLmFwcGVuZChcInN2ZzppbWFnZVwiKVxuICAgIC5hdHRyKFwieGxpbms6aHJlZlwiLCBmdW5jdGlvbihkKXtcbiAgICAgIHJldHVybiBkLmluZm8ucGljdHVyZTtcbiAgICB9KVxuICAgIC5hdHRyKFwieFwiLCAtMjApXG4gICAgLmF0dHIoXCJ5XCIsIC02OClcbiAgICAuYXR0cihcImhlaWdodFwiLCBcIjQwcHhcIilcbiAgICAuYXR0cihcIndpZHRoXCIsIFwiNDBweFwiKVxuICAgIC5vbignY2xpY2snLCBmdW5jdGlvbihkKXtcbiAgICAgIE1vZGFsLnNob3dQZXJzb25JbmZvKHBhZ2UsIGQuaW5mbyk7XG4gICAgfSk7XG59XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBVcGRhdGVcbmZ1bmN0aW9uIHVwZGF0ZShwYWdlLCBzb3VyY2UsIG5vZGVHcm91cHMpIHtcbiAgdmFyIGNvbmZpZyA9IHBhZ2UuY29uZmlnO1xuICB2YXIgZHVyYXRpb24gPSBjb25maWcuZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCk7XG5cbiAgLy8gVXBkYXRlIHRoZSBkYXRhIGFuZCB0cmFuc2l0aW9uIG5vZGVzIHRvIHRoZWlyIG5ldyBwb3NpdGlvbi5cbiAgdmFyIG5vZGVVcGRhdGUgPSBub2RlR3JvdXBzLnRyYW5zaXRpb24oKVxuICAgICAgLmR1cmF0aW9uKGR1cmF0aW9uKVxuICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oZCkge1xuXHRcdFx0ICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyBkLnggKyBcIixcIiArIGQueSArIFwiKVwiO1xuICAgICAgfSk7XG4gIG5vZGVVcGRhdGUuc2VsZWN0KFwiY2lyY2xlXCIpXG4gICAgLmF0dHIoXCJyXCIsIDEwKVxuICAgIC5zdHlsZShcImZpbGxcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5fY2hpbGRyZW4gPyBcImxpZ2h0c3RlZWxibHVlXCIgOiBcIiNmZmZcIjsgfSk7XG59XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBFeGl0XG5mdW5jdGlvbiBleGl0KHBhZ2UsIHNvdXJjZSwgbm9kZUdyb3Vwcykge1xuICB2YXIgY29uZmlnID0gcGFnZS5jb25maWc7XG4gIHZhciBkdXJhdGlvbiA9IGNvbmZpZy5nZXRUcmFuc2l0aW9uRHVyYXRpb24oKTtcblxuICAvLyBUcmFuc2l0aW9uIGV4aXRpbmcgbm9kZXMgdG8gdGhlIHBhcmVudCdzIG5ldyBwb3NpdGlvbi5cbiAgdmFyIG5vZGVFeGl0ID0gbm9kZUdyb3Vwcy5leGl0KCkudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24oZHVyYXRpb24pXG4gICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIHNvdXJjZS54ICsgXCIsXCIgKyBzb3VyY2UueSArIFwiKVwiOyB9KVxuICAgICAgLnJlbW92ZSgpO1xufVxuIiwiLy8gTW9kdWxlc1xudmFyIFV0aWwgPSByZXF1aXJlKCcuL3V0aWwuanMnKTtcbnZhciBOb2RlcyA9IHJlcXVpcmUoJy4vbm9kZXMuanMnKTtcbnZhciBMaW5rcyA9IHJlcXVpcmUoJy4vbGlua3MuanMnKTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIE1haW4gZnVuY3Rpb24gZm9yIHJlbmRlcmluZ1xuZnVuY3Rpb24gcmVuZGVyKHBhZ2UpIHtcbiAgdmFyIGNvbmZpZyA9IHBhZ2UuY29uZmlnO1xuICB2YXIgcm9vdCA9IHBhZ2Uucm9vdDtcbiAgdmFyIHRyZWVXaWR0aCA9IGNvbmZpZy5nZXRUcmVlV2lkdGgoKTtcblxuICByb290LngwID0gdHJlZVdpZHRoIC8gMjtcblx0cm9vdC55MCA9IDA7XG5cbiAgaWYocm9vdC5jaGlsZHJlbikge1xuICAgIHJvb3QuY2hpbGRyZW4uZm9yRWFjaChVdGlsLnRvZ2dsZUFsbCk7XG4gIH1cblxuICB1cGRhdGUocGFnZSwgcm9vdCk7XG5cbn1cbmV4cG9ydHMucmVuZGVyID0gcmVuZGVyO1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gRnVuY3Rpb25zIGZvciBwcm9jZXNzaW5nIGxpbmtzIGxpc3RcbmZ1bmN0aW9uIHVwZGF0ZShwYWdlLCBzb3VyY2UpIHtcbiAgdmFyIGNvbmZpZyA9IHBhZ2UuY29uZmlnO1xuICB2YXIgZHVyYXRpb24gPSBjb25maWcuZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCk7XG4gIHZhciBsaW5rSGVpZ2h0ID0gY29uZmlnLmdldExpbmtIZWlnaHQoKTtcbiAgdmFyIHRyZWVMYXlvdXQgPSBwYWdlLnRyZWVMYXlvdXQ7XG4gIHZhciB0cmVlRGF0YSA9IHBhZ2Uucm9vdDtcbiAgdmFyIG5vZGVzTGlzdCA9IGNhbGN1bGF0ZU5vZGVzTGlzdChwYWdlKTtcblxuICAvLyBVcGRhdGUgbm9kZXNcbiAgTm9kZXMudXBkYXRlTm9kZXMocGFnZSwgc291cmNlLCBub2Rlc0xpc3QpO1xuXG4gIC8vIFVwZGF0ZSBsaW5rc1xuICBMaW5rcy51cGRhdGVMaW5rcyhwYWdlLCBzb3VyY2UsIG5vZGVzTGlzdCk7XG5cbiAgLy8gY29tcHV0ZSB0aGUgbmV3IHRyZWUgaGVpZ2h0XG5cbiAgVXRpbC51cGRhdGVUcmVlRGlhZ3JhbUhlaWdodChwYWdlKTtcblxuICAvLyBTdGFzaCB0aGUgb2xkIHBvc2l0aW9ucyBmb3IgdHJhbnNpdGlvbi5cbiAgbm9kZXNMaXN0LmZvckVhY2goZnVuY3Rpb24oZCkge1xuICAgIGQueDAgPSBkLng7XG4gICAgZC55MCA9IGQueTtcbiAgfSk7XG59XG5leHBvcnRzLnVwZGF0ZSA9IHVwZGF0ZTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIEZ1bmN0aW9uIGZvciBjYWxjdWxhdGluZyBub2RlcyBsaXN0IHBvc2l0aW9uIHVzaW5nIGQzIGFwaVxuZnVuY3Rpb24gY2FsY3VsYXRlTm9kZXNMaXN0KHBhZ2UpIHtcbiAgdmFyIGNvbmZpZyA9IHBhZ2UuY29uZmlnO1xuICB2YXIgbGlua0hlaWdodCA9IGNvbmZpZy5nZXRMaW5rSGVpZ2h0KCk7XG4gIHZhciB0cmVlRGF0YSA9IHBhZ2Uucm9vdDtcbiAgdmFyIHRyZWVMYXlvdXQgPSBwYWdlLnRyZWVMYXlvdXQ7XG4gIHZhciBub2Rlc0xpc3Q7XG5cbiAgbm9kZXNMaXN0ID0gdHJlZUxheW91dC5ub2Rlcyh0cmVlRGF0YSkucmV2ZXJzZSgpO1xuICBub2Rlc0xpc3QuZm9yRWFjaChmdW5jdGlvbihkKXtcbiAgICBkLnkgPSBkLmRlcHRoICogbGlua0hlaWdodDtcbiAgICBkLnkgKz0gODA7XG4gIH0pO1xuXG4gIHJldHVybiBub2Rlc0xpc3Q7XG59XG4iLCJ2YXIganF1ZXJ5ID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgcSA9IHJlcXVpcmUoJ3EnKTtcblxuLy8gR2V0IHRyZWUgZGF0YVxuLy8gUmV0dXJucyBhIHByb21pc2VcbmZ1bmN0aW9uIGdldFRyZWVEYXRhKHBhZ2UpIHtcbiAgdmFyIGNvbmZpZyA9IHBhZ2UuY29uZmlnO1xuICB2YXIgcm9vdElkID0gY29uZmlnLmdldFBlcnNvbklkKCk7XG4gIHZhciB0cmVlRGVwdGggPSBjb25maWcuZ2V0VHJlZURlcHRoKCk7XG4gIHZhciB1cmwgPSBcIi90cmVlL2RhdGFcIjtcblxuICByZXR1cm4gcS5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAganF1ZXJ5LmFqYXgoe1xuICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHBlcnNvbklkOiByb290SWQsXG4gICAgICAgIGRlcHRoOiB0cmVlRGVwdGhcbiAgICAgIH0sXG4gICAgICB1cmw6IHVybCxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgcGFnZS5yb290ID0gZGF0YTtcbiAgICAgICAgcmVzb2x2ZShkYXRhKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5leHBvcnRzLmdldFRyZWVEYXRhID0gZ2V0VHJlZURhdGE7XG4iLCIvLyBMaWJzXG52YXIgZDMgPSByZXF1aXJlKCdkMycpO1xudmFyIGpxdWVyeSA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG4vLyBDb21wb25lbnRzXG52YXIgdHJlZUNvbnRhaW5lciA9IGpxdWVyeSgnI2pzLXRyZWUtY29udGFpbmVyJyk7XG5cbi8vIFRvZ2dsZSBjaGlsZHJlblxuZnVuY3Rpb24gdG9nZ2xlQWxsKGQpIHtcbiAgaWYgKGQuY2hpbGRyZW4pIHtcbiAgICBkLmNoaWxkcmVuLmZvckVhY2godG9nZ2xlQWxsKTtcbiAgICB0b2dnbGUoZCk7XG4gIH1cbn1cbmV4cG9ydHMudG9nZ2xlQWxsID0gdG9nZ2xlQWxsO1xuXG5mdW5jdGlvbiB0b2dnbGUoZCkge1xuICBpZiAoZC5jaGlsZHJlbikge1xuICAgIGQuX2NoaWxkcmVuID0gZC5jaGlsZHJlbjtcbiAgICBkLmNoaWxkcmVuID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICBkLmNoaWxkcmVuID0gZC5fY2hpbGRyZW47XG4gICAgZC5fY2hpbGRyZW4gPSBudWxsO1xuICB9XG59XG5leHBvcnRzLnRvZ2dsZSA9IHRvZ2dsZTtcblxuZnVuY3Rpb24gZmluZE1heERlcHRoKHJvb3QpIHtcbiAgdmFyIGN1cnJlbnRNYXhEZXB0aCA9IDA7XG4gIGZpbmRNYXhEZXB0aFJlY3Vyc2l2ZShyb290KTtcblxuICBmdW5jdGlvbiBmaW5kTWF4RGVwdGhSZWN1cnNpdmUocGFyZW50KSB7XG4gICAgaWYocGFyZW50LmNoaWxkcmVuICYmIHBhcmVudC5jaGlsZHJlbi5sZW5ndGggPiAwKXtcblx0XHRcdHBhcmVudC5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRmaW5kTWF4RGVwdGhSZWN1cnNpdmUoZCk7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2UgaWYocGFyZW50LmRlcHRoID4gY3VycmVudE1heERlcHRoKXtcblx0XHRcdGN1cnJlbnRNYXhEZXB0aCA9IHBhcmVudC5kZXB0aDtcblx0XHR9XG4gIH1cblxuICByZXR1cm4gY3VycmVudE1heERlcHRoO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVUcmVlRGlhZ3JhbUhlaWdodChwYWdlKSB7XG4gIC8vIGNhbGN1bGF0ZSBuZXcgaGVpZ2h0XG4gIHZhciBjb25maWcgPSBwYWdlLmNvbmZpZztcbiAgdmFyIGxpbmtIZWlnaHQgPSBjb25maWcuZ2V0TGlua0hlaWdodCgpO1xuICB2YXIgbWF4RGVwdGggPSBmaW5kTWF4RGVwdGgocGFnZS5yb290KTtcblx0dmFyIG5ld0hlaWdodCA9IChtYXhEZXB0aCAqIGxpbmtIZWlnaHQpICsgMTAwO1xuICB2YXIgZHVyYXRpb24gPSBjb25maWcuZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCkgKyAxMDA7XG5cbiAgLy8gdXBkYXRlIHRoZSBkaXNwbGF5IGhlaWdodFxuICB2YXIgcm9vdFN2ZyA9IHBhZ2Uucm9vdFN2ZztcbiAgcm9vdFN2Zy50cmFuc2l0aW9uKCkuZHVyYXRpb24oZHVyYXRpb24pXG4gICAgLmF0dHIoJ2hlaWdodCcsIG5ld0hlaWdodCk7XG4gIHRyZWVDb250YWluZXIuYW5pbWF0ZSh7XG4gICAgaGVpZ2h0OiBuZXdIZWlnaHRcbiAgfSwgZHVyYXRpb24pO1xuXG4gIC8vIGFkZCB0byB0aGUgY29uZmlnXG4gIGNvbmZpZy5zZXRUcmVlSGVpZ2h0KG5ld0hlaWdodCk7XG59XG5leHBvcnRzLnVwZGF0ZVRyZWVEaWFncmFtSGVpZ2h0ID0gdXBkYXRlVHJlZURpYWdyYW1IZWlnaHQ7XG4iXX0=
