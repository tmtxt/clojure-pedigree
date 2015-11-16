// Libs
var util = require('./util.js');
var microEvent = require('microevent');
var _ = require('_');

function init(opts) {
  var partner = opts.partner;
  var person;

  if(!!partner.husband) {
    person = partner.husband;
  } else {
    person = partner.wife;
  }
  person = util.normalizePerson(person);
  person.canRemove = false;
  this.partners.push(person);

  return this;
}

// Partner Store
var store = {
  // data
  partners: [],

  // funcs
  init: init
};
module.exports = store;

store.getPartners = function() {
  return this.partners;
};

store.addPartner = function(person) {
  person = util.normalizePerson(person);
  person.canRemove = true;
  this.partners.push(person);
  this.trigger('change');
};

store.removePartner = function(id) {
  var partners = _.filter(this.partners, function(partner){
    return partner.id !== id;
  });
  this.partners = partners;
  this.trigger('change');
};

microEvent.mixin(store);
