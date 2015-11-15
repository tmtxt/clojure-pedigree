// Config
var config = require('../config.js');

// Global Stores
var stores = {
  ChildStore: null,
  FamilyStore: null,
  ParentStore: null,
  PersonStore: null
};
module.exports = stores;

// Init Functions
stores.init = function(opts) {
  // Assign
  this.childStore = require('./child_store.js');

  if (config.isFromChild()) {
    this.childStore.init(opts);
  }
};
