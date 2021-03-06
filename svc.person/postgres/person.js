'use strict';

var Sequelize = require('sequelize');
const _ = require('lodash');
var sequelize = require('./db.js');
const moment = require('moment');

const aliveStatusValues = ['alive', 'dead', 'unknown'];
const genderValues = ['male', 'female', 'gay', 'les', 'unknown'];
const instanceProps = [
  'id',
  'fullName',
  'birthDate',
  'deathDate',
  'aliveStatus',
  'job',
  'address',
  'picture',
  'gender',
  'phoneNo',
  'summary'
];
const defaultPersonPicture = '/assets/img/userbasic.jpg';
const gendersDisplay = {
  'male': 'Nam',
  'female': 'Nữ',
  'gay': 'Gay',
  'les': 'Les',
  'unknown': 'Không rõ'
};
const aliveStatusesDisplay = {
  'alive': 'Còn sống',
  'dead': 'Đã mất',
  'unknown': 'Không rõ'
};

function makeDateValue(v) {
  // timestamp
  if (_.isNumber(v)) {
    return new Date(v);
  }

  if (_.isString(v)) {
    let format = 'DD/MM/YYYY';
    let date = moment(v, format);
    if (date.isValid()) {
      return new Date(date.valueOf());
    }
  }

  return null;
}

module.exports = sequelize.define('person', {
  full_name: Sequelize.STRING,
  birth_date: Sequelize.DATE,
  death_date: Sequelize.DATE,
  alive_status: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {
      isIn: [aliveStatusValues]
    }
  },
  job: Sequelize.STRING,
  address: Sequelize.STRING,
  picture: Sequelize.STRING,
  gender: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {
      isIn: [genderValues]
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
    },
    picture: function() {
      const fileName = this.getDataValue('picture');
      if (_.isNil(fileName)) {
        return defaultPersonPicture;
      }

      if (_.startsWith(fileName, '/assets')) {
        return fileName;
      }

      return `/images/person/original/${fileName}`;
    }
  },

  setterMethods: {
    fullName: function(v) {
      this.setDataValue('full_name', v);
    },
    birthDate: function(v) {
      this.setDataValue('birth_date', makeDateValue(v));
    },
    deathDate: function(v) {
      this.setDataValue('death_date', makeDateValue(v));
    },
    aliveStatus: function(v) {
      this.setDataValue('alive_status', v);
    },
    phoneNo: function(v) {
      this.setDataValue('phone_no', v);
    }
  },

  instanceMethods: {
    getData: function(opts) {
      opts = opts || {};
      const fields = opts.fields;
      const readable = opts.readable;

      if (readable) {
        this.gender = _.get(gendersDisplay, this.gender, 'Không rõ');
        this.aliveStatus = _.get(aliveStatusesDisplay, this.aliveStatus, 'Không rõ');
        const birthDate = moment(this.birthDate);
        if (birthDate.isValid()) {
          this.setDataValue('birth_date', birthDate.format('DD/MM/YYYY'));
        }
        const deathDate = moment(this.deathDate);
        if (deathDate.isValid()) {
          this.setDataValue('death_date', deathDate.format('DD/MM/YYYY'));
        }
      }

      if (fields) {
        return _.pick(this.fields);
      }
      return _.pick(this, instanceProps);
    }
  },

  classMethods: {
    findByIds: function(ids){
      return this.findAll({
        where: {
          id: ids
        }
      });
    },

    findByName: function(name) {
      return this.findAll({
        where: {
          full_name: {
            $iLike: `%${name}%`
          }
        }
      });
    },

    findByGenders: function(genders) {
      return this.findAll({
        where: {
          gender: {
            $in: genders
          }
        }
      });
    },

    findByGender: function(gender) {
      return this.findByGenders([gender]);
    }
  },

  timestamps: false,
  tableName: 'tbl_person'
});
