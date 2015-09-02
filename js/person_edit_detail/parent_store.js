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

  var FindPersonStore = global.stores.findPerson;
  if(this.parent.mother.selected) {

  } else {
    FindPersonStore.reset();
  }
}

function removeMother() {
  var mother = getPerson();
  this.parent.mother = mother;

  var FindPersonStore = global.stores.findPerson;
}

var store = {
  parent: null,
  getParent: getParent,
  getFather: getFather,
  getMother: getMother,
  removeFather: removeFather,
  removeMother: removeMother
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
  var father = parent.father;
  if (!!father) {
    father = normalizePerson(father);
  } else {
    father = getPerson();
  }

  var mother = parent.mother;
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
