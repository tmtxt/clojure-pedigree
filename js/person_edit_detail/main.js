// Libs
var jquery = require('jquery');
var React = require('react');

// Components
var birthDateInput = jquery('.js-birthdate-input');
var deathDateInput = jquery('.js-deathdate-input');

// Init
birthDateInput.datepicker({
  language: 'vi'
});
deathDateInput.datepicker({
  language: 'vi'
});

//
var ProfileView = require('./profile.jsx');
React.render(
  React.createElement(ProfileView),
  document.getElementById('js-profile-container')
);
