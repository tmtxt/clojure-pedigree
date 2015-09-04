var global;
var microEvent = require('microevent');

function getFather() {
  return this.father;
}

function getMother() {
  return this.mother;
}

function removeFather() {
  if(!this.addFromFather()) {
    var father = getPerson();
    this.father = father;
  }
}

function removeMother() {
  if(!this.addFromMother()) {
    var mother = getPerson();
    this.mother = mother;
  }
}

function isFatherSelected() {
  return this.father.selected;
}

function isMotherSelected() {
  return this.mother.selected;
}

function addFromFather() {
  return this.fromFather && !this.fromMother;
}

function addFromMother() {
  return this.fromMother && !this.fromFather;
}

function addFromNone() {
  return !this.fromFather && !this.fromMother;
}

//
function getPerson() {
  return {
    id: null,
    fullName: "Not selected",
    picture: "/assets/img/userbasic.jpg",
    selected: false
  };
}

function normalizePerson(person) {
  return {
    id: person.id,
    fullName: person.full_name,
    picture: person.picture,
    selected: true
  };
}

function init(opts) {
  global = require('./global.js');

  var parent = opts.parent;
  var father;
  var mother;

  if(!!parent) {
    if(!!parent.father) {
      // add from father
      father = normalizePerson(parent.father);
      mother = getPerson();
      this.fromFather = true;
      this.fromMother = false;
    } else {
      // add from mother
      mother = normalizePerson(parent.mother);
      father = getPerson();
      this.fromFather = false;
      this.fromMother = true;
    }
    this.father = father;
    this.mother = mother;
  } else {
    // not add from parent
  }

  return this;
}

var store = {
  // data
  father: null,
  mother: null,
  fromFather: false,
  fromMother: false,

  // funcs
  init: init,
  getFather: getFather,
  getMother: getMother,
  removeFather: removeFather,
  removeMother: removeMother,
  isFatherSelected: isFatherSelected,
  isMotherSelected: isMotherSelected,
  addFromMother: addFromMother,
  addFromFather: addFromFather,
  addFromNone: addFromNone
};
module.exports = store;

microEvent.mixin(store);
