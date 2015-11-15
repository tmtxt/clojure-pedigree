var global;
var microEvent = require('microevent');
var util = require('./util.js');

function init(opts) {
  global = require('./global.js');

  var person = opts.person;

  if (!!person) {
    person = util.normalizePerson(person);
  } else {
    person = {};
  }

  this.person = person;
  return this;
}

function getPerson() {
  return this.person;
}

var store = {
  // data
  person: null,

  // funcs
  init: init,
  getPerson: getPerson
};
module.exports = store;
