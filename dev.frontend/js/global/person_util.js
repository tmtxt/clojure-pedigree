'use strict';

const _ = require('lodash');
const personFields = ['id', 'fullName', 'picture', 'address', 'phoneNo', 'summary', 'gender',
                      'aliveStatus', 'birthDate', 'deathDate', 'job'];

exports.personFields = personFields;
exports.statusesList = {
  'alive': 'Còn sống',
  'dead': 'Đã mất',
  'unknown': 'Không rõ'
};
exports.gendersList = {
  'male': 'Nam',
  'female': 'Nữ',
  'unknown': 'Không rõ'
};

exports.createEmptyPerson = function() {
  return _.zipObject(personFields, []);
}

exports.getDefaultPictureLink = function() {
  return '/assets/img/userbasic.jpg';
}
