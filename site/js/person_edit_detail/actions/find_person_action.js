////////////////////////////////////////////////////////////////////////////////
// Libs
var jquery = require('jquery');
var q = require("q");

var global;
var stores;

function init(opts, gbl) {
  global = gbl;
  stores = global.stores;
}

// Picture action
var action = {
  init: init,
  selectPerson: selectPerson
};
module.exports = action;

// Components
var findPersonModal = jquery('.js-find-person-modal');
var selectBoxContainer = jquery('.js-select-person-container');
var selectPersonButton = jquery('.js-confirm-select-person-button');

////////////////////////////////////////////////////////////////////////////////
// Functions
function createSelectBox() {
  selectBoxContainer.empty();
  var selectBox = document.createElement('select');
  selectBox = jquery(selectBox);
  selectBox.addClass('js-find-person-select');
  selectBox.css('width', '100%');
  selectBoxContainer.append(selectBox);
  return selectBox;
}

function createTemplateResult(person) {
  if (!!person.id) {
    var div  = document.createElement('div');
    div = jquery(div);
    div.addClass('findperson-result-item');
    var imgDiv  = document.createElement('div');
    imgDiv = jquery(imgDiv);
    imgDiv.addClass('img-rounded');
    var img = document.createElement('img');
    img = jquery(img);
    img.attr('src', person.picture);
    img.addClass('img-responsive');
    var span = document.createElement('span');
    span = jquery(span);
    span.html(person['full-name']);

    imgDiv.append(img);
    div.append(imgDiv);
    div.append(span);

    return div;
  }

  return "";
}

function createTemplateSelection(person) {
  if (!!person.id) {
    var div  = document.createElement('div');
    div = jquery(div);
    div.addClass('findperson-selected-item');
    var imgDiv  = document.createElement('div');
    imgDiv = jquery(imgDiv);
    imgDiv.addClass('img-rounded');
    var img = document.createElement('img');
    img = jquery(img);
    img.attr('src', person.picture);
    img.addClass('img-responsive');
    var span = document.createElement('span');
    span = jquery(span);
    span.html(person['full-name']);

    imgDiv.append(img);
    div.append(imgDiv);
    div.append(span);

    return div;
  }

  return "Type name to select";
}

// Select person with modal
// Returns a promise, resolve when finish selection, reject when not select
function selectPerson(data) {
  return q.Promise(function(resolve, reject){
    var selectedPerson;
    if (data.length !== 0) {
      selectedPerson = data[0];
    }

    var selectBox;
    selectBox = createSelectBox();
    selectBox.select2({
      data: data,
      placeholder: 'Select',
      templateResult: createTemplateResult,
      templateSelection: createTemplateSelection
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
