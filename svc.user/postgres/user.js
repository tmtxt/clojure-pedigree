'use strict';

var Sequelize = require('sequelize');
const _ = require('lodash');
var sequelize = require('./db.js');

const instanceProps = [
  'id',
  'fullName',
  'email',
  'password',
  'username'
];

module.exports = sequelize.define('user', {
  full_name: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  username: Sequelize.STRING
}, {
  getterMethods: {
    fullName: function() {
      return this.getDataValue('full_name');
    }
  },

  setterMethods: {
    fullName: function(v) {
      this.setDataValue('full_name', v);
    }
  },

  instanceMethods: {
    getData: function(fields) {
      if (fields) {
        return _.pick(this.fields);
      }
      return _.pick(this, instanceProps);
    }
  },

  timestamps: false,
  tableName: 'tbl_user'
});
