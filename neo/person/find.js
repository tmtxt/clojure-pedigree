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
