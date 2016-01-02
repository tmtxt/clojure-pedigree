var system = require('./system.js');

var config = new Map([
  ['appName', 'neo node']
]);

var main = new Map(function*() {
  yield* system;
  yield* config;
}());

module.exports = main;
