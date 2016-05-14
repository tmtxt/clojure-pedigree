'use strict';

const send = require('./util.js').send;


function* findRoot(logTrace) {
  return yield send('person', '/find/root', 'get', {}, logTrace);
}


function* findById(personId, logTrace) {
  const body = {personId};
  return yield send('person', '/find/byId', 'get', body, logTrace);
}


function* findByIds(personIds, logTrace) {
  const body = {personIds};
  return yield send('person', '/find/byIds', 'get', body, logTrace);
}

module.exports = {
  findRoot,
  findById,
  findByIds
};
