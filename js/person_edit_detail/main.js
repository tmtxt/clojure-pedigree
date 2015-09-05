// Libs
var React = require('react');
var flux = require("flux");

// Data
var statuses = window.statuses;
var genders = window.genders;
var parent = window.parent;
var partner = window.partner;
var findPersonList = window.findPersonList;
var fromPerson = window.fromPerson;

// Global Object
var global = require('./global.js').init({
  fromPerson: fromPerson
});

// Store
var pictureStore = require('./picture_store.js');
var parentStore = require('./parent_store.js');
var familyStore = require('./family_store.js');
global.stores.picture = pictureStore;
global.stores.parent = parentStore;
global.stores.family = familyStore;

// Actions
var pictureAction = require('./picture_action.js');
var parentAction = require('./parent_action.js');
var familyAction = require('./family_action.js');
var findPersonAction = require('./find_person_action.js');
global.actions.picture = pictureAction;
global.actions.parent = parentAction;
global.actions.family = familyAction;
global.actions.findPerson = findPersonAction;

// Init
pictureStore.init();
parentStore.init({
  parent: parent
});
familyStore.init({
  partner: partner
});

pictureAction.init();
parentAction.init();
familyAction.init();
findPersonAction.init();

// // Store
// var parentStore = require('./parent_store.js');
// parentStore.init(parent);
// global.stores.parent = parentStore.store;
// var familyStore = require('./family_store.js');
// familyStore.init(partner);
// global.stores.family = familyStore.store;
// var findPersonStore = require('./find_person_store.js');
// findPersonStore.init(findPersonList);
// global.stores.findPerson = findPersonStore.store;

// // Dispatcher
// var dispatcher = require('./dispatcher.js');
// dispatcher.init();
// global.dispatcher = dispatcher.dispatcher;

// // Action
// var parentAction = require('./parent_action.js');
// parentAction.init();
// global.actions.parent = parentAction.action;
// var findPersonAction = require('./find_person_action.js');
// findPersonAction.init();
// global.actions.findPerson = findPersonAction.action;

// Components
var MainView = require('./main_view.jsx');

// Start rendering
React.render(
  React.createElement(MainView,
                      {statuses: statuses,
                       genders: genders,
                       parent: parent}),
  document.getElementById('js-editperson-container')
);
