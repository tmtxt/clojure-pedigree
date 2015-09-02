// Libs
var React = require('react');
var flux = require("flux");

// Data
var statuses = window.statuses;
var genders = window.genders;
var parent = window.parent;

// Global Object
var global = require('./global.js');

// Store and Action
var parentStore = require('./parent_store.js');
var parentAction = require('./parent_action.js');
parentStore.init(parent);
parentAction.init();
global.stores.parent = parentStore.store;
global.actions.parent = parentAction.action;

// Dispatcher
var dispatcher = require('./dispatcher.js');
dispatcher.init();
global.dispatcher = dispatcher.dispatcher;

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
