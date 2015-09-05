//
function getPerson() {
  return {
    id: null,
    fullName: "Not selected",
    picture: "/assets/img/userbasic.jpg",
    selected: false
  };
}
exports.getPerson = getPerson;

function normalizePerson(person) {
  var fullName = person.fullName || person.full_name;

  return {
    id: person.id,
    fullName: fullName,
    picture: person.picture,
    selected: true
  };
}
exports.normalizePerson = normalizePerson;
