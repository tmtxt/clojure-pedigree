var global = require('./global.js');

var store = {
  partners: []
};
exports.store = store;

function normalizePerson(person) {
  return {
    id: person.id,
    fullName: person.full_name,
    picture: person.picture,
    selected: true
  };
}

function init(partner) {
}
exports.init = init;
