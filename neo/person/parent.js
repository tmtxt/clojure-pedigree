function countParentsHandler(req, res, next) {
  var app = req.app;
  var neo4j = app.get('neo4j');
  var query = app.get('query').get('countParents');
  var personId = req.body.personId;

  neo4j.query(query, {id: personId}, function(err, results) {
    if (err) {
      res.json({success: false});
      return;
    }

    var count = 0;
    if (results.length !== 0) {
      count = results[0].count;
    }
    res.json({success: true, data: count});
  });
}
exports.countParentsHandler = countParentsHandler;
