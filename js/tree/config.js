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

module.exports = config;
