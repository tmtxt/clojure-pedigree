'use strict';

const Sequelize = require('sequelize');
const _ = require('lodash');
const sequelize = require('./db.js');

const instanceProps = [
  'id',
  'key',
  'value'
];

module.exports = sequelize.define('user', {
  key: {
    type: Sequelize.STRING,
    allowNull: false
  },
  value: Sequelize.STRING
}, {
  instanceMethods: {
    getData: function(fields) {
      if (fields) {
        return _.pick(this.fields);
      }
      return _.pick(this, instanceProps);
    }
  },

  classMethods: {
    findByKey: function(key, opts) {
      return this.findOne({
        where: {key}
      }, opts);
    }
  },

  timestamps: false,
  tableName: 'tbl_minor_content'
});
