// Libs
var React = require('react');

//
var statuses = window.statuses;
var genders = window.genders;

// Render profile view
var ProfileView = require('./profile.jsx');
React.render(
  React.createElement(ProfileView,
                      {statuses: statuses,
                       genders: genders}),
  document.getElementById('js-profile-container')
);
