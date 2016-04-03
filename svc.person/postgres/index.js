var config = require('../config');

var Sequelize = require('sequelize');
var sequelize = new Sequelize(
  config.postgresDb,
  config.postgresUser,
  config.postgresPassword,
  {
    dialect: 'postgres',
    host: config.postgresHost,
    port: config.postgresPort
  }
);

exports.db = sequelize();
