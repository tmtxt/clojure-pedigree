var system = require('./system.js');

var config = new Map([
  ['appName', 'neo node']
]);

var main = new Map([config, system]);

module.exports = config;
