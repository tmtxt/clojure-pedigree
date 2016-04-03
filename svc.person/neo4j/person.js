'use strict';

var neo = require('./db.js');

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
    neo.save(data, 'person', function(err, node) {
      if (err) {
        reject(err);
        return;
      }

      resolve(node);
    });
  });

  return promise;
};
