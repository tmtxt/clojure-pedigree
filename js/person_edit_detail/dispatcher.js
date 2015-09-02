var flux = require("flux");
var Dispatcher = new flux.Dispatcher();
exports.dispatcher = Dispatcher;

function init() {
  var global = require('./global.js');
}
exports.init = init;
