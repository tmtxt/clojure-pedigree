// Libs
var React = require('react');
var flux = require("flux");

// Data
var statuses = window.statuses;
var genders = window.genders;
var parent = window.parent;
var findPersonList = window.findPersonList;

// Global Object
var global = require('./global.js');

// Store
var parentStore = require('./parent_store.js');
parentStore.init(parent);
global.stores.parent = parentStore.store;
var findPersonStore = require('./find_person_store.js');
findPersonStore.init(findPersonList);
global.stores.findPerson = findPersonStore.store;

// Dispatcher
var dispatcher = require('./dispatcher.js');
dispatcher.init();
global.dispatcher = dispatcher.dispatcher;

// Action
var parentAction = require('./parent_action.js');
parentAction.init();
global.actions.parent = parentAction.action;
var findPersonAction = require('./find_person_action.js');
findPersonAction.init();
global.actions.findPerson = findPersonAction.action;

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
