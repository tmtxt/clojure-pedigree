// Libs
var microEvent = require('microevent');
var util = require('./util.js');

//
function init(opts) {
  var parent = opts.parent;
  var parentPartners = opts.parentPartners;
  var father;
  var mother;

  if(!!parent) {
    if(!!parent.father) {
      // add from father
      father = util.normalizePerson(parent.father);
      if (parentPartners.length !== 0) {
        mother = util.normalizePerson(parentPartners[0]);
      } else {
        mother = util.getPerson();
      }
    } else {
      // add from mother
      mother = util.normalizePerson(parent.mother);
      if (parentPartners.length !== 0) {
        father = util.normalizePerson(parentPartners[0]);
      } else {
        father = util.getPerson();
      }
    }
  } else {
    father = util.getPerson();
    mother = util.getPerson();
  }
  this.father = father;
  this.mother = mother;
  this.partners = parentPartners;

  return this;
}

// Parent Store
var store = {
  // data
  father: null,
  mother: null,
  partners: [],

  // funcs
  init: init
};
module.exports = store;

microEvent.mixin(store);

// Get Functions
store.getFather = function() {
  return this.father;
};

store.getMother = function() {
  return this.mother;
};

store.getPartners = function() {
  return this.partners;
};

// Set Functions
store.setFather = function(person) {
  person = util.normalizePerson(person);
  this.father = person;
  this.trigger('change');
};

store.setMother = function(person) {
  person = util.normalizePerson(person);
  this.mother = person;
  this.trigger('change');
};

// Remove Functions
store.removeFather = function() {
  var father = util.getPerson();
  this.father = father;
  this.trigger('change');
};

store.removeMother = function() {
  var mother = util.getPerson();
  this.mother = mother;
  this.trigger('change');
};

// Predicate Functions
store.isMotherSelected = function() {
  return this.mother.selected;
};

store.isFatherSelected = function() {
  return this.father.selected;
};
