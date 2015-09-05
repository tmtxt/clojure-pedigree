var global;
var microEvent = require('microevent');

function getFather() {
  return this.father;
}

function getMother() {
  return this.mother;
}

function setFather(person) {
  person = normalizePerson(person);
  this.father = person;
  this.triggerChanged();
}

function setMother(person) {
  person = normalizePerson(person);
  this.mother = person;
  this.triggerChanged();
}

function removeFather() {
  if(!this.addFromFather()) {
    var father = getPerson();
    this.father = father;
    this.triggerChanged();
  }
}

function removeMother() {
  if(!this.addFromMother()) {
    var mother = getPerson();
    this.mother = mother;
    this.triggerChanged();
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

function canChangeFather() {
  return !this.addFromFather();
}

function canChangeMother() {
  return !this.addFromMother();
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
  var fullName = person.fullName || person.full_name;

  return {
    id: person.id,
    fullName: fullName,
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
  } else {
    father = getPerson();
    mother = getPerson();
    this.fromFather = false;
    this.fromMother = false;
  }
  this.father = father;
  this.mother = mother;

  return this;
}

var store = {
  // data
  father: null,
  mother: null,
  fromFather: false,
  fromMother: false,
  fromParent: false,

  // funcs
  init: init,
  triggerChanged: triggerChanged,
  bindChanged: bindChanged,
  unbindChanged: unbindChanged,
  getFather: getFather,
  getMother: getMother,
  setFather: setFather,
  setMother: setMother,
  removeFather: removeFather,
  removeMother: removeMother,
  isFatherSelected: isFatherSelected,
  isMotherSelected: isMotherSelected,
  addFromMother: addFromMother,
  addFromFather: addFromFather,
  addFromNone: addFromNone,
  canChangeFather: canChangeFather,
  canChangeMother: canChangeMother
};
module.exports = store;

microEvent.mixin(store);
