var jquery = require('jquery');
var React = require('react');

var findPersonModal = jquery('.js-find-person-modal');
var selectBoxContainer = jquery('.js-select-person-container');

function createSelectBox() {
  selectBoxContainer.empty();
  var selectBox = document.createElement('select');
  selectBox = jquery(selectBox);
  selectBox.addClass('js-find-person-select');
  selectBox.css('width', '100%');
  selectBoxContainer.append(selectBox);
  return selectBox;
}

function selectMother() {
  var global = require('./global.js');
  var ParentStore = global.stores.parent;
  var data;

  if(ParentStore.isFatherSelected()) {
    data = {
      parentId: ParentStore.getFather().id
    };
  } else {
    data = {};
  }
  select(data);
}
exports.selectMother = selectMother;

function selectFather() {
  var global = require('./global.js');
  var ParentStore = global.stores.parent;
  var data;

  if(ParentStore.isMotherSelected()) {
    data = {
      parentId: ParentStore.getMother().id
    };
  } else {
    data = {};
  }
  select(data);
}
exports.selectFather = selectFather;

function select(data) {
  console.log(data);
}

function select2() {
  var global = require('./global.js');

  var FindPersonStore = global.stores.findPerson;
  var selectBox = createSelectBox();

  if(FindPersonStore.isEnable()) {
    selectBox.select2({
      data: FindPersonStore.getPersonList(),
      placeholder: 'Select',
      templateResult: function(person) {
        return person.full_name;
      }
    });
  } else {
    selectBox.select2({
      ajax: {
        url: '/person/find',
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
  }

  findPersonModal.modal();
}
exports.select = select;
