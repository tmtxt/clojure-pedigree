'use strict';

// lib
const neo = require('./db.js');
const query = require('../query');

function getTree(rootId, depth) {
  const execution = function(resolve, reject){
    neo.query(query.getTree, {id: rootId, depth}, function(err, results){
      if (err) {
        reject(err);
        return
      }

      resolve(results);
    });
  };
  const promise = new Promise(execution);

  return promise;
}

module.exports = {
  getTree
};
