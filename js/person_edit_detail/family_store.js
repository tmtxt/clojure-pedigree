var global;
var microEvent = require('microevent');
var util = require('./util.js');

function init(opts) {
  global = require('./global.js');

  var partner = opts.partner;
  var person;
  if(!!partner) {
    if(!!partner.husband) {
      person = partner.husband;
      this.fromHusband = true;
    } else {
      person = partner.wife;
      this.fromWife = true;
    }
    person = util.normalizePerson(person);
    person.canRemove = false;
    this.partners.push(person);
  }

  return this;
}

function getPartners() {
  return this.partners;
}

var store = {
  // data
  partners: [],
  fromHusband: false,
  fromWife: false,

  // funcs
  init: init,
  getPartners: getPartners
};
module.exports = store;

microEvent.mixin(store);
