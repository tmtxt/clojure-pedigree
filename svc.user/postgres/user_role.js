'use strict';

var Sequelize = require('sequelize');
const _ = require('lodash');
var sequelize = require('./db.js');

const instanceProps = [
  'id',
  'user_id',
  'role_name'
];

module.exports = sequelize.define('user', {
  user_id: Sequelize.STRING,
  role_name: Sequelize.STRING
}, {
  getterMethods: {
    userId: function() {
      return this.getDataValue('user_id');
    },
    roleName: function() {
      return this.getDataValue('role_name');
    }
  },

  setterMethods: {
    userId: function(v) {
      this.setDataValue('user_id', v);
    },
    roleName: function(v) {
      this.setDataValue('role_name', v);
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
  tableName: 'tbl_user_role'
});
