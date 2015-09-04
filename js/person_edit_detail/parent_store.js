var global = require('./global.js');

//
function getParent() {
  return this.parent;
}

function getFather() {
  return this.parent.father;
}

function getMother() {
  return this.parent.mother;
}

function removeFather() {
  var father = getPerson();
  this.parent.father = father;
}

function removeMother() {
  var mother = getPerson();
  this.parent.mother = mother;
}

function isFatherSelected() {
  return this.parent.father.selected;
}

function isMotherSelected() {
  return this.parent.mother.selected;
}

var store = {
  parent: null,
  getParent: getParent,
  getFather: getFather,
  getMother: getMother,
  removeFather: removeFather,
  removeMother: removeMother,
  isFatherSelected: isFatherSelected,
  isMotherSelected: isMotherSelected
};
exports.store = store;

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

function init(parent) {
  var father;
  var mother;
  if(!!parent) {
    father = parent.father;
    mother = parent.mother;
  }

  if (!!father) {
    father = normalizePerson(father);
  } else {
    father = getPerson();
  }

  if (!!mother) {
    mother = normalizePerson(mother);
  } else {
    mother = getPerson();
  }

  parent = {
    father: father,
    mother: mother
  };
  store.parent = parent;
}
exports.init = init;
