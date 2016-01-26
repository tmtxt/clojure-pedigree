// Libs
var React = require('react');
var flux = require("flux");

// Data
var statuses = window.statuses;
var genders = window.genders;
var parent = window.parent;
var parentPartners = window.parentPartners;
var partner = window.partner;
var child = window.child;
var person = window.person;
var findPersonList = window.findPersonList;
var fromPerson = window.fromPerson;
var action = window.formAction;

var global = {};

var config = require('./config.js');
global.config = config;
config.init({
  action: action,
  fromPerson: fromPerson,
  statusesList: statuses,
  gendersList: genders,
  partner: partner,
  parent: parent
}, global);

var stores = require('./stores/main.js');
global.stores = stores;
stores.init({
  child: child,
  partner: partner,
  parent: parent,
  person: person,
  parentPartners: parentPartners
}, global);

var actions = require('./actions/main.js');
global.actions = actions;
actions.init({}, global);

var util = require('./util.js');
global.util = util;

// Render
var MainView = require('./views/main_view.jsx')(global);
React.render(
  React.createElement(MainView, {}),
  document.getElementById('js-editperson-container')
);
