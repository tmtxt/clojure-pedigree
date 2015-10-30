// Libs
var jquery = require('jquery');
var q = require("q");

// Modules
var global;
var PictureStore;

// init func
function init(opts) {
  global = require('./global.js');
  PictureStore = global.stores.picture;

  return this;
}

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

// select picture
function selectPicture() {
  selectFile().then(function(url){
    PictureStore.setPictureLink(url);
  });
}

// remove picture
function removePicture() {
  PictureStore.removePictureLink();
}

var action = {
  init: init,
  selectPicture: selectPicture,
  removePicture: removePicture
};
module.exports = action;
