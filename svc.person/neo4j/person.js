'use strict';

var neo = require('./db.js');
var changeCase = require('change-case-object');

const label = 'person';

/**
 * Save person node to neo4j
 *
 * @param  {object} person The person model
 * @param {boolean} isRoot Whether this person is root or not
 * @return {object} The newly inserted node
 */
exports.save = function(person, isRoot) {
  var data = {
    personId: person.id,
    isRoot: isRoot
  };
  data = changeCase.snakeCase(data);

  var promise = new Promise(function(resolve, reject){
    neo.save(data, label, function(err, node) {
      if (err) {
        reject(err);
        return;
      }

      resolve(changeCase.camelCase(node));
    });
  });

  return promise;
};

/**
 * Find person node by person id
 *
 * @param  {object} personId The person id
 * @return {object} The person node
 */
exports.find = function(personId) {
  var data = {
    personId: personId
  };
  data = changeCase.snakeCase(data);

  var promise = new Promise(function(resolve, reject) {
    neo.find(data, label, function(err, nodes){
      if (err) {
        reject(err);
        return;
      }

      if (nodes.length === 0) {
        resolve(null);
        return;
      }

      resolve(changeCase.camelCase(nodes[0]));
    });
  });

  return promise;
};

/**
 * Delete person node by person id
 *
 * @param  {object} node The person node
 * @return {object} The person node
 */
exports.delete = function(node) {
  var promise = new Promise(function(resolve, reject) {
    neo.delete(node, true, function(err) {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });

  return promise;
};

/**
 * Find root node
 *
 * @return {object} The person node
 */
exports.findRoot = function() {
  const promise = new Promise(function(resolve, reject) {
    var data = changeCase.snakeCase({isRoot: true});

    neo.find(data, 'person', function(err, persons){
      if (err) {
        reject(err);
        return;
      }

      if (persons.length === 0) {
        resolve(null);
        return;
      }

      resolve(changeCase.camelCase(persons[0]));
    });
  });

  return promise;
};
