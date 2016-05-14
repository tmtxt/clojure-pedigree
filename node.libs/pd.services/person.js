'use strict';

const send = require('./util.js').send;


function* findRoot(logTrace) {
  return yield send('person', '/find/root', 'get', {}, logTrace);
}


function* findById(personId, logTrace) {
  const body = {personId};
  return yield send('person', '/find/byId', 'get', body, logTrace);
}

module.exports = {
  findRoot,
  findById
};
