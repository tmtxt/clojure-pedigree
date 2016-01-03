var _ = require('lodash');

function findMatchingPerson(neo4j, personId) {
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

function findMatchingRelation(neo4j, parentNode, childNode, type) {
  return new Promise(function(resolve, reject){
    neo4j.relationships(parentNode, 'out', type, function(err, results){
      if (err) {
        reject(err);
        return;
      }

      var rel = null;
      _.each(results, function(result){
        if (result.end == childNode.id) {
          rel = result;
        }
      });
      resolve(rel);
    });
  });
}

function linkNodes(neo4j, parentNode, childNode, type, props) {
  return new Promise(function(resolve, reject){
    neo4j.relate(parentNode, type, childNode, props, function(err, rel){
      if (err) {
        reject(err);
        return;
      }

      resolve(rel);
    });
  });
}

function updateRel(neo4j, rel, order) {
  return new Promise(function(resolve, reject){
    rel.properties.order = order;
    neo4j.rel.update(rel, function(err, rel){
      if (err) {
        reject(err);
        return;
      }

      resolve(rel);
    });
  });
}

function addChildForParentHandler(req, res, next) {
  var app = req.app;
  var neo4j = app.get('neo4j');
  var parentId = req.body.parentId;
  var childId = req.body.childId;
  var type = req.body.type;
  var order = req.body.order;

  var findParent = findMatchingPerson(neo4j, parentId);
  var findChild = findMatchingPerson(neo4j, childId);

  var parentNode, childNode;

  Promise.all([findParent, findChild]).then(function(values){
    parentNode = values[0];
    childNode = values[1];
    return findMatchingRelation(neo4j, parentNode, childNode, type);
  }).then(function(rel){
    if (!!rel) {
      if (!!order) {
        return updateRel(neo4j, rel, order);
      }
      return rel;
    }
    return linkNodes(neo4j, parentNode, childNode, type, {order: order});
  }).then(function(){
    res.json({success: true, data: "success"});
  }).catch(function(err){
    res.json({success: false});
  });
}
exports.addChildForParentHandler = addChildForParentHandler;
