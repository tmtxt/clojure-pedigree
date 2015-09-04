// Modules
var global;
var ParentStore;

//
function init(opts) {
  global = require('./global.js');
  ParentStore = global.stores.parent;

  return this;
}

function removeFather() {
  ParentStore.removeFather();
}

function removeMother() {
  ParentStore.removeMother();
}

var action = {
  init: init,
  removeFather: removeFather,
  removeMother: removeMother
};
module.exports = action;
