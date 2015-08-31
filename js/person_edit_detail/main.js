// Libs
var React = require('react');

// Components
var MainView = require('./main_view.jsx');

// Data
var statuses = window.statuses;
var genders = window.genders;
var parent = window.parent;

// Start rendering
React.render(
  React.createElement(MainView,
                      {statuses: statuses,
                       genders: genders,
                       parent: parent}),
  document.getElementById('js-editperson-container')
);
