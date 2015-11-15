var global;
var defaultLink = "/assets/img/userbasic.jpg";
var microEvent = require('microevent');

function init(opts) {
  global = require('./global.js');
  var person = opts.person;

  if (!!person && !!person.picture) {
    this.setPictureLink(person.picture);
  }

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

function bindChanged(func) {
  this.bind('change', func);
}

function unbindChanged(func) {
  this.unbind('change', func);
}

var store = {
  // data
  pictureLink: defaultLink,

  // funcs
  init: init,
  triggerChanged: triggerChanged,
  bindChanged: bindChanged,
  unbindChanged: unbindChanged,
  setPictureLink: setPictureLink,
  removePictureLink: removePictureLink,
  getPictureLink: getPictureLink
};
module.exports = store;

microEvent.mixin(store);
