function init(config) {
  var dbHost = config.get('neo4jHost');
  var dbPort = config.get('neo4jPort');

  var db = require('seraph')(`http://${dbHost}:${dbPort}`);

  return db;
}
exports.init = init;
