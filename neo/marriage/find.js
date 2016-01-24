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
