// Libs
var jquery = require('jquery');

// Init
function init() {
  // Find components
  var birthDateInput = jquery('.js-birthdate-input');
  var deathDateInput = jquery('.js-deathdate-input');

  birthDateInput.datepicker({
    language: 'vi'
  });
  deathDateInput.datepicker({
    language: 'vi'
  });
}
exports.init = init;
