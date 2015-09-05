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
  } else {
    data = {
      parentRole: 'father'
    };
  }
  FindPersonAction.selectPerson(data).then(function(person){
    ParentStore.setFather(person);
  });
}

function selectMother() {
  var data = {};
  if(ParentStore.isFatherSelected()) {
    data = {
      parentId: ParentStore.getFather().id
    };
  } else {
    data = {
      parentRole: 'mother'
    };
  }
  FindPersonAction.selectPerson(data).then(function(person){
    ParentStore.setMother(person);
  });
}

var action = {
  init: init,
  removeFather: removeFather,
  removeMother: removeMother,
  selectFather: selectFather,
  selectMother: selectMother
};
module.exports = action;
