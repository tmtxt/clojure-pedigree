// Libs
var React = require('react');
var flux = require("flux");

// Data
var statuses = window.statuses;
var genders = window.genders;
var parent = window.parent;

// Flux
var Dispatcher = new flux.Dispatcher();
var parentStore = require('./parent_store.js');
var parentAction = require('./parent_action.js');

// Init
parentStore.init(parent);
parentAction.init();

// Global Object
var global = require('./global.js');
global.dispatcher = Dispatcher;
global.stores.parent = parentStore.store;
global.actions.parent = parentAction.action;

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
