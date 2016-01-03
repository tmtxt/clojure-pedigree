function findMatching(neo4j, personId) {
  return new Promise(function(resolve, reject) {
    neo4j.find({person_id: personId}, 'person', function(err, persons){
      if (err) {
        reject(err);
        return;
      }

      if (persons.length !== 0) {
        resolve(persons[0]);
      } else {
        resolve(null);
      }
    });
  });
}

function deleteNode(neo4j, node) {
  return new Promise(function(resolve, reject){
    if (!node) {
      resolve();
      return;
    }

    neo4j.delete(node, function(err){
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function deleteHandler(req, res, next) {
  var app = req.app;
  var neo4j = app.get('neo4j');
  var personId = req.body.personId;

  findMatching(neo4j, personId).then(function(person){
    return deleteNode(neo4j, person);
  }).then(function(){
    res.json({success: true, data: "success"});
  }).catch(function(){
    res.json({success: false});
  });
}
exports.deleteHandler = deleteHandler;
