var jquery = require('jquery');
var React = require('react');

var findPersonModal = jquery('.js-find-person-modal');

function select() {
  var global = require('./global.js');
  var FindPersonStore = global.stores.findPerson;
  var selectBox = jquery('.js-find-person-select');
  console.log(FindPersonStore.getPersonList());
  if(FindPersonStore.isEnable()) {
    selectBox.select2({
      data: FindPersonStore.getPersonList(),
      templateResult: function(person) {
        return person.full_name;
      }
    });
  } else {

  }

  findPersonModal.modal();
}
exports.select = select;
