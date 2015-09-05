// Modules
var global;
var FamilyStore;

function init(opts) {
  global = require('./global.js');
  FamilyStore = global.stores.family;

  return this;
}

var action = {
  init: init
};
module.exports = action;
