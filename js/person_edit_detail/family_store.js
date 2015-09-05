var global;
var microEvent = require('microevent');
var util = require('./util.js');

function init(opts) {
  global = require('./global.js');

  var partner = opts.partner;
  if(!!partner) {
    partner = util.normalizePerson(partner);
    this.partners.push(partner);
  }

  return this;
}

function getPartners() {
  return this.partners;
}

var store = {
  // data
  partners: [],

  // funcs
  init: init,
  getPartners: getPartners
};
module.exports = store;

microEvent.mixin(store);
