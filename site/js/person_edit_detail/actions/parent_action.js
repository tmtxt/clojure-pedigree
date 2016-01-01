////////////////////////////////////////////////////////////////////////////////
// Libs
var jquery = require('jquery');
var q = require("q");

var global;
var stores;
var ParentStore;
var FindPersonAction;

function init(opts, gbl) {
  global = gbl;
  stores = global.stores;
  ParentStore = stores.ParentStore;
  FindPersonAction = global.actions.FindPersonAction;
}

// Picture action
var action = {
  init: init
};
module.exports = action;

////////////////////////////////////////////////////////////////////////////////
// Select Functions
action.selectFather = function() {
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
};

action.selectMother = function() {
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
};

////////////////////////////////////////////////////////////////////////////////
// Remove Functions
action.removeMother = function() {
  ParentStore.removeMother();
};

action.removeFather = function() {
  ParentStore.removeFather();
};
