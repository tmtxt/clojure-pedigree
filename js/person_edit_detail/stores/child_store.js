// Libs
var util = require('./util.js');

function init(opts) {
  var child = opts.child;

  if(!!child) {
    child = util.normalizePerson(child);
  }
  this.child = child;

  return this;
}

function getChild() {
  return this.child;
}

// Child Store
var store = {
  // data
  child: null,

  // funcs
  init: init,
  getChild: getChild
};
module.exports = store;
