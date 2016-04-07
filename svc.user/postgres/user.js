'use strict';

const Sequelize = require('sequelize');
const _ = require('lodash');
const sequelize = require('./db.js');
const bcrypt = require('bcrypt-nodejs');

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
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  getterMethods: {
    fullName: function() {
      return this.getDataValue('full_name');
    }
  },

  setterMethods: {
    fullName: function(v) {
      this.setDataValue('full_name', v);
    },
    password: function(v) {
      const hashedPassword = bcrypt.hashSync(v);
      this.setDataValue('password', hashedPassword);
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

  classMethods: {
    findByUsername: function(username) {
      return this.findOne({
        where: {username}
      });
    }
  },

  timestamps: false,
  tableName: 'tbl_user'
});
