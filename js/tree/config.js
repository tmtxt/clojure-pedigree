// Libs
var jquery = require('jquery');
var d3 = require('d3');

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

module.exports = config;
