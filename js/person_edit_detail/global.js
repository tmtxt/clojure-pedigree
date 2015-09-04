// Libs
var EventEmitter = require('EventEmitter');

function init(opts) {
  opts = opts || {};

  var ee = new EventEmitter();
  this.ee = ee;

  return this;
}

var global = {
  // event emiiter
  ee: null,

  // actions
  actions: {
    picture: null
  },

  // stores
  stores: {
    picture: null
  },

  // funcs
  init: init
};
module.exports = global;
