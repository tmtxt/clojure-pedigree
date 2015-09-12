var global;
var microEvent = require('microevent');
var util = require('./util.js');

function onAddPage() {
  return this.action === "add";
}

function onEditPage() {
  return this.action === "edit";
}

function getActionLink() {
  return this.actionLink;
}

function init(opts) {
  global = require('./global.js');

  var action = opts.action || "add";
  this.action = action;

  var actionLink;
  if (this.action === "add") {
    actionLink = "/person/add/process";
  } else {
    actionLink = "/person/edit";
  }
  this.actionLink = actionLink;

  return this;
}

var store = {
  // data
  action: null,
  actionLink: null,

  // funcs
  init: init,
  onAddPage: onAddPage,
  onEditPage: onEditPage,
  getActionLink: getActionLink
};
module.exports = store;

microEvent.mixin(store);
