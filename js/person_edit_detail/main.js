// Libs
var React = require('react');

// Components
var MainView = require('./main_view.jsx');

// Data
var statuses = window.statuses;
var genders = window.genders;

// Start rendering
React.render(
  React.createElement(MainView,
                      {statuses: statuses,
                       genders: genders}),
  document.getElementById('js-editperson-container')
);
