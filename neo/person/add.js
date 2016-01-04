var _ = require('lodash');

function findMatching(neo4j, data) {
  return new Promise(function(resolve, reject) {
    if (!!data.person_id) {
      neo4j.find({person_id: data.person_id}, 'person', function(err, persons){
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
    } else {
      resolve(null);
    }
  });
}

function addOrUpdate(neo4j, data) {
  return new Promise(function(resolve, reject){
    var handler = function(err, person){
      if (err) {
        reject(err);
        return;
      }
      resolve(person);
    };

    if (!!data.id) {
      neo4j.save(data, handler);
    } else {
      neo4j.save(data, 'person', handler);
    }
  });
}

function addOrUpdateHandler(req, res, next) {
  var app = req.app;
  var neo4j = app.get('neo4j');
  var data = req.body.data;

  if (!data) {
    res.json({success: false});
    return;
  }

  findMatching(neo4j, data).then(function(person){
    if (!!person) data = _.extend(person, data);
    return addOrUpdate(neo4j, data);
  }).then(function(person){
    res.json({success: true, data: person});
  }).catch(function(){
    res.json({success: false});
  });
}
exports.addOrUpdateHandler = addOrUpdateHandler;
