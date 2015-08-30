// Libs
var React = require('react');

//
var statuses = window.statuses;

// Render profile view
var ProfileView = require('./profile.jsx');
React.render(
  React.createElement(ProfileView, {statuses: statuses}),
  document.getElementById('js-profile-container')
);
