// Libs
var React = require('react');

// Render profile view
var ProfileView = require('./profile.jsx');
React.render(
  React.createElement(ProfileView),
  document.getElementById('js-profile-container')
);
