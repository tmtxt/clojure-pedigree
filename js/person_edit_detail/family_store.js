var global;
var microEvent = require('microevent');
var util = require('./util.js');
var _ = require('_');

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

function addFromHusband() {
  return this.fromHusband;
}

function addFromWife() {
  return this.fromWife;
}

function addFromNone() {
  return !this.fromHusband && !this.fromWife;
}

function addPartner(person) {
  person = util.normalizePerson(person);
  person.canRemove = true;
  this.partners.push(person);
  this.triggerChanged();
}

function removePartner(id) {
  var partners = _.filter(this.partners, function(partner){
    return partner.id !== id;
  });
  this.partners = partners;
  this.triggerChanged();
}

function triggerChanged() {
  this.trigger('change');
}

function bindChanged(func) {
  this.bind('change', func);
}

function unbindChanged(func) {
  this.unbind('change', func);
}

var store = {
  // data
  partners: [],
  fromHusband: false,
  fromWife: false,

  // funcs
  init: init,
  getPartners: getPartners,
  addFromHusband: addFromHusband,
  addFromWife: addFromWife,
  addFromNone: addFromNone,
  addPartner: addPartner,
  removePartner: removePartner,
  triggerChanged: triggerChanged,
  bindChanged: bindChanged,
  unbindChanged: unbindChanged
};
module.exports = store;

microEvent.mixin(store);
