// Libs
var util = require('./util.js');

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
  this.partner = person;

  return this;
}

// Partner Store
var store = {
  // data
  partner: null,

  // funcs
  init: init
};
module.exports = store;

store.getPartner = function() {
  return this.partner;
};
