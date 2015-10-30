// Libs
var EventEmitter = require('EventEmitter');

function init(opts) {
  opts = opts || {};

  var ee = new EventEmitter();
  this.ee = ee;

  this.fromPerson = opts.fromPerson;

  return this;
}

function addFromParent() {
  return this.fromPerson === 'parent';
}

function addFromPartner() {
  return this.fromPerson === 'partner';
}

function addFromChild() {
  return this.fromPerson === 'child';
}

function addFromNone() {
  return !this.addFromParent() && !this.addFromPartner() && !this.addFromChild();
}

var global = {
  // event emiiter
  ee: null,
  fromPerson: null,

  // actions
  actions: {
    picture: null
  },

  // stores
  stores: {
    picture: null
  },

  // funcs
  init: init,
  addFromParent: addFromParent,
  addFromPartner: addFromPartner,
  addFromChild: addFromChild,
  addFromNone: addFromNone
};
module.exports = global;
