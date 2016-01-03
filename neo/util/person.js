function findPersonNodeByPersonId(neo4j, personId) {
  return new Promise(function(resolve, reject){
    var data = {person_id: personId};
    neo4j.find(data, 'person', function(err, persons){
      if (err || persons.length === 0) {
        reject();
        return;
      }

      resolve(persons[0]);
    });
  });
}

var util = {
  findPersonNodeByPersonId: findPersonNodeByPersonId
};
module.exports = util;
