var global;
var defaultLink = "/assets/img/userbasic.jpg";
var microEvent = require('microevent');

function init(opts) {
  global = require('./global.js');

  return this;
}

function setPictureLink(link) {
  this.pictureLink = link;
  this.triggerChanged();
  return this;
}

function removePictureLink() {
  this.pictureLink = defaultLink;
  this.triggerChanged();
  return this;
}

function getPictureLink() {
  return this.pictureLink;
}

function triggerChanged() {
  this.trigger('change');
}

var store = {
  // data
  pictureLink: defaultLink,

  // funcs
  init: init,
  triggerChanged: triggerChanged,
  setPictureLink: setPictureLink,
  removePictureLink: removePictureLink,
  getPictureLink: getPictureLink
};
module.exports = store;

microEvent.mixin(store);
