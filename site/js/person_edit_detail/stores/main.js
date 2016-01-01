// Global Stores
var stores = {
  ChildStore: null,
  PartnerStore: null,
  ParentStore: null,
  PersonStore: null
};
module.exports = stores;

// Init Functions
stores.init = function(opts, global) {
  // Assign
  var config = global.config;
  this.ChildStore = require('./child_store.js');
  this.PartnerStore = require('./partner_store.js');
  this.ParentStore = require('./parent_store.js');
  this.PersonStore = require('./person_store.js');

  // init
  this.PersonStore.init(opts);
  if (config.isFromChild()) {
    this.ChildStore.init(opts);
  }
  if (config.isFromPartner()) {
    this.PartnerStore.init(opts);
  }
  if (config.isFromParent()) {
    this.ParentStore.init(opts);
  }
};
