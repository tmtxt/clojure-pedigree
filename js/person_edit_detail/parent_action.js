var global = require("./global.js");
var dispatcher = global.dispatcher;

var action = {
  removeFather: function() {
    dispatcher.dispatch({
      eventName: 'remove-father'
    });
  }
};
exports.action = action;

function init() {

}
exports.init = init;
