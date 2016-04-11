'use strict';

// lib
const neo = require('./db.js');
const changeCase = require('change-case-object');
const _ = require('lodash');
const query = require('../query');

// labels
const fatherChildLabel = 'father_child';
const motherChildLabel = 'mother_child';

// Find relation between parent and child node based on type (label) of the relation
function findMatchingRelation(parentNode, childNode, type) {
  const promise = new Promise(function(resolve, reject){
    neo.relationships(parentNode, 'out', type, handlerFunc);
    function handlerFunc(err, results) {
      if (err) {
        reject(err);
        return;
      }

      var rel = null;
      _.each(results, function(result) {
        if (result.end == childNode.id) {
          rel = result;
        }
      });
      resolve(rel);
    }
  });

  return promise;
}

// Add relation between parent and child node
function addRelation(parentNode, childNode, type, childOrder) {
  const props = {
    order: childOrder
  };
  const promise = new Promise(function(resolve, reject){
    neo.relate(parentNode, type, childNode, props, function(err, rel){
      if (err) {
        reject(err);
        return;
      }

      resolve(rel);
    });
  });

  return promise;
}

// Update existing relation
function updateRelation(relation, childOrder) {
  const promise = new Promise(function(resolve, reject){
    relation.properties.order = childOrder;
    neo.rel.update(relation, function(err, rel){
      if (err) {
        reject(err);
        return;
      }

      resolve(rel);
    });
  });

  return promise;
}

// Link parent and child node (add or update the existing relation)
function* linkNodes(parentNode, childNode, type, childOrder) {
  childOrder = childOrder || 0;
  const relation = yield findMatchingRelation(parentNode, childNode, type);

  if (!relation) {
    let rel = yield addRelation(parentNode, childNode, type, childOrder);
    rel = changeCase.camelCase(rel);
    return rel;
  }

  let rel = yield updateRelation(relation, childOrder);
  rel = changeCase.camelCase(rel);
  return rel;
}

// Add relation for father and child
function* addChildForFather(fatherNode, childNode, childOrder) {
  return yield linkNodes(fatherNode, childNode, fatherChildLabel, childOrder);
}

// Add relation for mother and child
function* addChildForMother(motherNode, childNode, childOrder) {
  return yield linkNodes(motherNode, childNode, motherChildLabel, childOrder);
}

// Add relation for both father, mother and child node
function* addChildForParent(fatherNode, motherNode, childNode, fatherChildOrder, motherChildOrder) {
  const fatherChildRelation = yield addChildForFather(fatherNode, childNode, fatherChildOrder);
  const motherChildRelation = yield addChildForMother(motherNode, childNode, motherChildOrder);

  return {
    fatherChildRelation,
    motherChildRelation
  };
}

// Count how many parents this node has
function countParents(personNodeId) {
  return new Promise(function(resolve, reject){
    neo.query(query.countParents, {id: personNodeId}, function(err, results){
      if (err) {
        reject();
        return;
      }

      let count = 0;
      if (results.length !== 0) {
        count = results[0].count;
      }
      resolve(count);
    });
  });
}

exports.addChildForFather = addChildForFather;
exports.addChildForMother = addChildForMother;
exports.addChildForParent = addChildForParent;
exports.countParents = countParents;
