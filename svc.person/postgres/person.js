var Sequelize = require('sequelize');
var sequelize = require('./db.js');

const aliveStatusValues = ['alive', 'dead', 'unknown'];
const genderValues = ['male', 'female', 'gay', 'les', 'unknown'];

module.exports = sequelize.define('person', {
  full_name: Sequelize.STRING,
  birth_date: Sequelize.DATE,
  death_date: Sequelize.DATE,
  alive_status: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {
      isIn: aliveStatusValues
    }
  },
  job: Sequelize.STRING,
  address: Sequelize.STRING,
  picture: Sequelize.STRING,
  gender: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {
      isIn: genderValues
    }
  },
  phone_no: Sequelize.STRING,
  summary: Sequelize.STRING
}, {
  getterMethods: {
    fullName: function() {
      return this.getDataValue('full_name');
    },
    birthDate: function() {
      return this.getDataValue('birth_date');
    },
    deathDate: function() {
      return this.getDataValue('death_date');
    },
    aliveStatus: function() {
      return this.getDataValue('alive_status');
    },
    phoneNo: function() {
      return this.getDataValue('phone_no');
    }
  },

  setterMethods: {
    fullName: function(v) {
      this.setDataValue('full_name', v);
    },
    birthDate: function(v) {
      this.setDataValue('birth_date', v);
    },
    deathDate: function(v) {
      this.setDataValue('death_date', v);
    },
    aliveStatus: function(v) {
      this.setDataValue('alive_status', v);
    },
    phoneNo: function(v) {
      this.setDataValue('phone_no', v);
    }
  },

  timestamps: false,
  tableName: 'tbl_person'
});
