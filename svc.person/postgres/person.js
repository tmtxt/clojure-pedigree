var sequelize = require('./db.js');

module.exports = sequelize.define('person', {
  underscored: true,
  tableName: 'tbl_person'
});
