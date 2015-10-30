// Libs
var jquery = require('jquery');
var q = require('q');

// Modules
var global;

// Components
var findPersonModal = jquery('.js-find-person-modal');
var selectBoxContainer = jquery('.js-select-person-container');
var selectPersonButton = jquery('.js-confirm-select-person-button');

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
  return q.Promise(function(resolve, reject){
    function makeData(params) {
      if(!!params.term) {
        data.term = params.term;
      }
      return data;
    }

    function processResults(data, page) {
      return {
        results: data
      };
    }

    var ajax = {
      url: '/person/find/list/simple',
      data: makeData,
      dataType: 'json',
      delay: 250,
      processResults: processResults
    };

    var selectedPerson;

    var selectBox = createSelectBox();
    selectBox.select2({
      ajax: ajax,
      placeholder: 'Select',
      templateResult: function(person) {
        return person.full_name;
      },
      templateSelection: function(person) {
        return person.full_name;
      }
    });
    selectBox.on('select2:select', function(e){
      selectedPerson = e.params.data;
    });
    selectBox.on('select2:unselect', function(e){
      selectedPerson = null;
    });

    unbindModal();
    findPersonModal.on('hide.bs.modal', function(){
      reject();
    });
    selectPersonButton.click(function(){
      unbindModal();
      findPersonModal.modal('hide');
      if(!!selectedPerson) {
        resolve(selectedPerson);
      } else {
        reject();
      }
    });
    findPersonModal.modal('show');
  });
}

function unbindModal() {
  findPersonModal.unbind();
  selectPersonButton.unbind();
}

var action = {
  init: init,
  selectPerson: selectPerson
};
module.exports = action;
