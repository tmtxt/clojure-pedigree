// Libs
var jquery = require('jquery');
var q = require('q');

// Modules
var global;

// Components
var findPersonModal = jquery('.js-find-person-modal');
var selectBoxContainer = jquery('.js-select-person-container');

// Init
function init(opts) {
  global = require('./global.js');

  return this;
}

function createSelectBox() {
  selectBoxContainer.empty();
  var selectBox = document.createElement('select');
  selectBox = jquery(selectBox);
  selectBox.addClass('js-find-person-select');
  selectBox.css('width', '100%');
  selectBoxContainer.append(selectBox);
  return selectBox;
}

// Select person with modal
// Returns a promise, resolve when finish selection, reject when not select
function selectPerson(data) {
  var selectBox = createSelectBox();
  selectBox.select2({
    ajax: {
      url: '/person/find',
      data: function(params) {
        if(!!params.term) {
          data.term = params.term;
        }
        return data;
      },
      dataType: 'json',
      delay: 250,
      processResults: function(data, page) {
        return {
          results: data
        };
      }
    },
    placeholder: 'Select',
    templateResult: function(person) {
      return person.full_name;
    }
  });
  findPersonModal.modal();
}

var action = {
  init: init,
  selectPerson: selectPerson
};
module.exports = action;
