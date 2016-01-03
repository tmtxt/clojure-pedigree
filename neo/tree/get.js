var util = require('util');

function getTreeHandler(req, res, next) {
  var app = req.app;
  var query = app.get('query').get('getTree');
  var rootId = req.body.rootId;
  var depth = req.body.depth;
  var neo4j = app.get('neo4j');

  query = util.format(query, rootId, depth);
  neo4j.query(query, function(err, results){
    if (err) {
      res.json({success: false});
      return;
    }

    res.json(results);
  });
}
exports.getTreeHandler = getTreeHandler;
