// Libs
var microEvent = require('microevent');
var util = require('./util.js');

//
function init(opts) {
  var parent = opts.parent;
  var father;
  var mother;

  if(!!parent) {
    if(!!parent.father) {
      // add from father
      father = util.normalizePerson(parent.father);
      mother = util.getPerson();
    } else {
      // add from mother
      mother = util.normalizePerson(parent.mother);
      father = util.getPerson();
    }
  } else {
    father = util.getPerson();
    mother = util.getPerson();
  }
  this.father = father;
  this.mother = mother;

  return this;
}

// Parent Store
var store = {
  // data
  father: null,
  mother: null,

  // funcs
  init: init
};
module.exports = store;

// Get Functions
store.getFather = function() {
  return this.father;
};

store.getMother = function() {
  return this.mother;
};

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
