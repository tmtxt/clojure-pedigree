function getPerson() {
  return {
    id: null,
    fullName: "Chưa chọn",
    picture: "/assets/img/userbasic.jpg",
    address: null,
    phoneNo: null,
    summary: null,
    gender: null,
    aliveStatus: null,
    birthDate: null,
    deathDate: null,
    createdAt: null,
    job: null,

    selected: false,
    canRemove: true
  };
}
exports.getPerson = getPerson;

function normalizePerson(person) {
  var fullName = person.fullName || person.full_name || person['full-name'];
  var phoneNo = person.phoneNo || person.phone_no || person['phone-no'];
  var deathDate = person.deathDate || person.death_date || person['death-date'];
  var birthDate = person.birthDate || person.birth_date || person['birth-date'];
  var createdAt = person.createdAt || person.created_at || person['created-at'];
  var aliveStatus = person.aliveStatus || person.alive_status || person['alive-status'];

  return {
    id: person.id,
    fullName: fullName,
    picture: person.picture,
    selected: true,
    canRemove: false,
    phoneNo: phoneNo,
    deathDate: deathDate,
    birthDate: birthDate,
    createdAt: createdAt,
    address: person.address,
    summary: person.summary,
    gender: person.gender,
    aliveStatus: aliveStatus,
    job: person.job
  };
}
exports.normalizePerson = normalizePerson;
