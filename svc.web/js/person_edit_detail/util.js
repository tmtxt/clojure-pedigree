// Libs
var jquery = require("jquery");

function initDatePicker() {
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
exports.initDatePicker = initDatePicker;

function initSummaryEditor() {
  var historyEditor = jquery(".js-history-editor");
  historyEditor.markdown({
    iconlibrary: "fa",
    resize: "vertical",
    height: 300
  });
}
exports.initSummaryEditor = initSummaryEditor;
