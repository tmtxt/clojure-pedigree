var microEvent = require('microevent');
var util = require('./util.js');

function init(opts) {
  var child = opts.child;

  if(!!child) {
    child = util.normalizePerson(child);
  } else {
    child = util.getPerson();
  }
  this.child = child;

  return this;
}

function getChild() {
  return this.child;
}

var store = {
  // data
  child: null,

  // funcs
  init: init,
  getChild: getChild
};
module.exports = store;

microEvent.mixin(store);
