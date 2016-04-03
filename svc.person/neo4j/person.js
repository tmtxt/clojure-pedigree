'use strict';

var neo = require('./db.js');

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
    person_id: person.id,
    is_root: isRoot
  };

  var promise = new Promise(function(resolve, reject){
    neo.save(data, label, function(err, node) {
      if (err) {
        reject(err);
        return;
      }

      resolve(node);
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
    person_id: personId
  };

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

      resolve(nodes[0]);
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
