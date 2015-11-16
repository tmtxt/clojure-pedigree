////////////////////////////////////////////////////////////////////////////////
// Libs
var jquery = require('jquery');
var q = require("q");

var global;
var stores;
var PersonStore;

function init(opts, gbl) {
  global = gbl;
  stores = global.stores;
  PersonStore = stores.PersonStore;
}

// Picture action
var action = {
  init: init
};
module.exports = action;

////////////////////////////////////////////////////////////////////////////////
// open file input selection for user to select an image
// Returns a promise, resolve with the image link if selected
// reject otherwise
function selectFile() {
  return q.Promise(function(resolve, reject){
    // find the picture input
    var pictureInput = jquery(".js-picture-input");
    // remove all event listeners
    pictureInput.unbind();
    // new event handler
    pictureInput.change(function(){
      var file = pictureInput[0].files[0];
      if(!!file) {
        if(!!window.URL.createObjectURL) {
          var imageLink = window.URL.createObjectURL(file);
          resolve(imageLink);
        } else {
          reject();
        }
      } else {
        // not select
        reject();
      }
    });
    // trigger selection
    pictureInput.trigger("click");
  });
}

// Select picture
action.selectPicture = function() {
  selectFile().then(function(url){
    PersonStore.setPicture(url);
  });
};

////////////////////////////////////////////////////////////////////////////////
// Remove picture
action.removePicture = function() {
  PersonStore.removePicture();
};
