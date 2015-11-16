// Libs
var util = require('./util.js');
var microEvent = require('microevent');

function init(opts) {
  var person = opts.person;

  if (!!person) {
    person = util.normalizePerson(person);
  } else {
    person = util.getPerson();
    person.fullName = "";
  }
  this.person = person;

  return this;
}

// Person Store
var store = {
  // data
  person: null,

  // funcs
  init: init
};
module.exports = store;

// Get Functions
store.getPerson = function() {
  return this.person;
};

// Update Functions
store.setPicture = function(link) {
  this.person.picture = link;
  this.trigger('change');
};

store.removePicture = function() {
  this.person.picture = "/assets/img/userbasic.jpg";
  this.trigger('change');
};

store.setAliveStatus = function(status) {
  this.person.aliveStatus = status;
  this.trigger('change');
};

microEvent.mixin(store);
