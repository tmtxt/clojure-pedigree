// Modules
var global;
var ParentStore;
var FindPersonAction;

//
function init(opts) {
  global = require('./global.js');
  ParentStore = global.stores.parent;
  FindPersonAction = global.actions.findPerson;

  return this;
}

function removeFather() {
  ParentStore.removeFather();
}

function removeMother() {
  ParentStore.removeMother();
}

function selectFather() {
  var data = {};
  if(ParentStore.isMotherSelected()) {
    data = {
      parentId: ParentStore.getMother().id
    };
  }
  FindPersonAction.selectPerson(data);
}

function selectMother() {
  var data = {};
  if(ParentStore.isFatherSelected()) {
    data = {
      parentId: ParentStore.getFather().id
    };
  }
  FindPersonAction.selectPerson(data);
}

var action = {
  init: init,
  removeFather: removeFather,
  removeMother: removeMother,
  selectFather: selectFather,
  selectMother: selectMother
};
module.exports = action;
