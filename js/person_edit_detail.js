// Libs
var jquery = require('jquery');

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
