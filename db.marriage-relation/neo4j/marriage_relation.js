'use strict';

// lib
const neo = require('./db.js');
const changeCase = require('change-case-object');
const _ = require('lodash');
const query = require('../query');

// labels
const husbandWifeLabel = 'husband_wife';
const wifeHusbandLabel = 'wife_husband';

// Find relation between two node
function findMatchingRelation(startNode, endNode, type) {
  const promise = new Promise(function(resolve, reject){
    neo.relationships(startNode, 'out', type, handlerFunc);
    function handlerFunc(err, results) {
      if (err) {
        reject(err);
        return;
      }

      var rel = null;
      _.each(results, function(result) {
        if (result.end == endNode.id) {
          rel = result;
        }
      });
      resolve(rel);
    }
  });

  return promise;
}

// Add relation between parent and child node
function addRelation(startNode, endNode, type, marriageOrder) {
  const props = {
    order: marriageOrder
  };
  const promise = new Promise(function(resolve, reject){
    neo.relate(startNode, type, endNode, props, function(err, rel){
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
function updateRelation(relation, marriageOrder) {
  const promise = new Promise(function(resolve, reject){
    relation.properties.order = marriageOrder;
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

// Link husband and wife node
function* addMarriage(husbandNode, wifeNode, husbandWifeOrder, wifeHusbandOrder) {
  husbandWifeOrder = husbandWifeOrder || 0;
  wifeHusbandOrder = wifeHusbandOrder || 0;
  var husbandWifeRelation = yield findMatchingRelation(
    husbandNode, wifeNode, husbandWifeLabel
  );
  var wifeHusbandRelation = yield findMatchingRelation(
    wifeNode, husbandNode, wifeHusbandLabel
  );

  if (!husbandWifeRelation) {
    husbandWifeRelation = yield addRelation(
      husbandNode, wifeNode, husbandWifeLabel, husbandWifeOrder
    );
    husbandWifeRelation = changeCase.camelCase(husbandWifeRelation);
  } else {
    husbandWifeRelation = yield updateRelation(husbandWifeRelation, husbandWifeOrder);
  }

  if (!wifeHusbandRelation) {
    wifeHusbandRelation = yield addRelation(
      wifeNode, husbandNode, wifeHusbandLabel, wifeHusbandOrder
    );
    wifeHusbandRelation = changeCase.camelCase(wifeHusbandRelation);
  } else {
    wifeHusbandRelation = yield updateRelation(wifeHusbandRelation, wifeHusbandOrder);
  }

  return {
    husbandWife: husbandWifeRelation,
    wifeHusband: wifeHusbandRelation
  };
}

// Find all partner nodes of this node
function findPartners(personNode) {
  const execution = function(resolve, reject) {
    neo.query(query.findPartners, {id: personNode}, function(err, results){
      if (err) {
        reject(err);
        return;
      }

      results = _.map(results, (result) => changeCase.camelCase(result));
      resolve(results);
    });
  };

  return new Promise(execution);
}

exports.addMarriage = addMarriage;
exports.findPartners = findPartners;
