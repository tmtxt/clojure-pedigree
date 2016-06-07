'use strict';

const personUtil = require('person_util.js');

exports.createEmptyPerson = function() {
  const person = personUtil.createEmptyPerson();
  person.picture = personUtil.getDefaultPictureLink();

  return person;
}
