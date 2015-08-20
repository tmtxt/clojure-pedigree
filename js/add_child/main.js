// Libs
var jquery = require('jquery');
var q = require('q');

// Modules
var Confirm = require('./confirm.js');

// Components
var submitButton = jquery('.js-submit-button');
var addChildForm = jquery('.js-add-child-form');
var childNameInput = jquery('.js-child-name-input');

//
submitButton.click(function(e){
  e.preventDefault();

  var childName = jquery.trim(childNameInput.val());
  if(childName === '') {
    Confirm.confirm().then(function(){
      addChildForm.trigger('submit');
    });
  } else {
    addChildForm.trigger('submit');
  }
});
