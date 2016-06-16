'use strict';

const moment = require('moment');

const api = require('API');
const apiPerson = api.person;

exports.createInitData = async function(tree) {
  const personId = tree.get(['params', 'personId']);
  const person = await apiPerson.getPerson(personId);

  // normalize date time display
  if (person.birthDate) {
    let birthDate = moment(person.birthDate);
    birthDate = birthDate.format('DD/MM/YYYY');
    person.birthDate = birthDate;
  }
  if (person.deathDate) {
    let deathDate = moment(person.deathDate);
    deathDate = deathDate.format('DD/MM/YYYY');
    person.birthDate = deathDate;
  }

  tree.set('person', person);
  tree.set('initializing', false);
};
