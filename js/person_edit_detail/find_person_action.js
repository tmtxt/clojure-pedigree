var global = require("./global.js");
var dispatcher = global.dispatcher;

var action = {
  selectMother: function() {
    dispatcher.dispatch({
      eventName: 'select-mother'
    });
  }
};
exports.action = action;

function init() {

}
exports.init = init;
