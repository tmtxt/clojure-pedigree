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
  'username',
  'language',
  'locale'
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
  },
  language: Sequelize.STRING
}, {
  getterMethods: {
    fullName: function() {
      return this.getDataValue('full_name');
    },
    locale: function() {
      return this.getDataValue('language');
    }
  },

  setterMethods: {
    fullName: function(v) {
      this.setDataValue('full_name', v);
    },
    password: function(v) {
      const hashedPassword = bcrypt.hashSync(v);
      this.setDataValue('password', hashedPassword);
    },
    locale: function(v) {
      this.setDataValue('language', v);
    }
  },

  instanceMethods: {
    getData: function(fields) {
      if (fields) {
        return _.pick(this.fields);
      }
      return _.pick(this, instanceProps);
    },
    isPasswordMatched: function(password) {
      return bcrypt.compareSync(password, this.getDataValue('password'));
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
