var global = require("./global.js");
var dispatcher = global.dispatcher;

var action = {
  removeFather: function() {
    dispatcher.dispatch({
      eventName: 'remove-father'
    });
  },

  removeMother: function() {
    dispatcher.dispatch({
      eventName: 'remove-mother'
    });
  }
};
exports.action = action;

function init() {

}
exports.init = init;
