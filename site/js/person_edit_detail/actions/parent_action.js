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
  FindPersonAction.selectPerson(ParentStore.getPartners()).then(function(person){
    ParentStore.setFather(person);
  });
};

action.selectMother = function() {
  FindPersonAction.selectPerson(ParentStore.getPartners()).then(function(person){
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
