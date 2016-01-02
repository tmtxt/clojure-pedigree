var _ = require('lodash');

function findRootHandler(req, res, next) {
  var neo4j = req.app.get('neo4j');

  neo4j.find({is_root: true}, 'person', function(err, persons) {
    if (err || persons.length === 0) {
      res.json({
        success: false,
        message: 'No root found'
      });
      return;
    }

    res.json({
      success: true,
      data: persons[0]
    });
  });
}
exports.findRootHandler = findRootHandler;

function findPersonHandler(req, res, next) {
  var neo4j = req.app.get('neo4j');
  var personId = req.body.personId;

  neo4j.find({person_id: personId}, 'person', function(err, persons){
    if (err || persons.length === 0) {
      res.json({success: false});
      return;
    }

    res.json({
      success: true,
      data: persons[0]
    });
  });
}
exports.findPersonHandler = findPersonHandler;

function findPartnersHandler(req, res, next) {
  var app = req.app;
  var neo4j = app.get('neo4j');
  var query = app.get('query').get('findPartners');
  var personId = req.body.personId;

  neo4j.query(query, {id: personId}, function(err, results){
    if (err) {
      res.json({success: false});
      return;
    }

    res.json({success: true, data: results});
  });
}
exports.findPartnersHandler = findPartnersHandler;

function findParentsHandler(req, res, next) {
  var app = req.app;
  var neo4j = app.get('neo4j');
  var query = app.get('query').get('findParents');
  var personId = req.body.personId;

  neo4j.query(query, {id: personId}, function(err, results){
    if (err) {
      res.json({success: false});
      return;
    }

    res.json({success: true, data: results});
  });
}
exports.findParentsHandler = findParentsHandler;
