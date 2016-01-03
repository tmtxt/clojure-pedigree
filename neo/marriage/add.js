function handleFindRelations(neo4j, util, husband, wife) {
  return Promise.all([util.relation.findRelationBetweenNodes(neo4j, husband, wife, 'husband_wife'),
                  util.relation.findRelationBetweenNodes(neo4j, wife, husband, 'wife_husband')]);
}

function handleDeleteRelations(neo4j, util, values) {
  var husbandWife = values[0];
  var wifeHusband = values[1];

  var promises = [];
  if (!!husbandWife) {
    promises.push(util.relation.deleteRelation(neo4j, husbandWife));
  }
  if (!!wifeHusband) {
    promises.push(util.relation.deleteRelation(neo4j, wifeHusband));
  }

  return Promise.all(promises);
}

function handleAddRelations(neo4j, util, husbandNode, wifeNode, order) {
  var props = {};
  if (!!order) props.order = order;

  return Promise.all([util.relation.addRelationBetweenNodes(neo4j, husbandNode, wifeNode, 'husband_wife', props),
                  util.relation.addRelationBetweenNodes(neo4j, wifeNode, husbandNode, 'wife_husband', props)]);
}

function addMarriageHandler(req, res, next) {
  var app = req.app;
  var neo4j = app.get('neo4j');
  var util = app.get('util');
  var husbandId = req.body.husbandId;
  var wifeId = req.body.wifeId;
  var order = req.body.order;

  var findHusband = util.person.findPersonNodeByPersonId(neo4j, husbandId);
  var findWife = util.person.findPersonNodeByPersonId(neo4j, wifeId);

  var husband, wife;

  Promise.all([findHusband, findWife])
    .then(function(values){
      husband = values[0];
      wife = values[1];
      return handleFindRelations(neo4j, util, husband, wife);
    })
    .then(function(values){
      return handleDeleteRelations(neo4j, util, values);
    })
    .then(function(){
      return handleAddRelations(neo4j, util, husband, wife, order);
    })
    .then(function(values){
      res.json({success: true, data: values});
    })
    .catch(function(err){
      console.log(err);
      res.json({success: false});
    });
}
exports.addMarriageHandler = addMarriageHandler;
