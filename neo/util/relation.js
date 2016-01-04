var _ = require('lodash');

// Find the relation with type between two nodes,
// resolve the last one found or null if not found
function findRelationBetweenNodes(neo4j, startNode, endNode, type) {
  return new Promise(function(resolve, reject){
    neo4j.relationships(startNode, 'out', type, function(err, results){
      if (err) {
        reject(err);
        return;
      }

      var rel = null;
      _.each(results, function(result){
        if (result.end == endNode.id) {
          rel = result;
        }
      });
      resolve(rel);
    });
  });
}

// Delete the input relation
// Returns a promise, resolve if success, reject otherwise
function deleteRelation(neo4j, rel) {
  return new Promise(function(resolve, reject){
    neo4j.rel.delete(rel, function(err){
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

// Add relation between two nodes
// Returns a promise, resolve the rel if success
function addRelationBetweenNodes(neo4j, startNode, endNode, type, props) {
  return new Promise(function(resolve, reject){
    neo4j.relate(startNode, type, endNode, props, function(err, rel){
      if (err) {
        reject(err);
        return;
      }

      resolve(rel);
    });
  });
}

var util = {
  findRelationBetweenNodes: findRelationBetweenNodes,
  deleteRelation: deleteRelation,
  addRelationBetweenNodes: addRelationBetweenNodes
};
module.exports = util;
