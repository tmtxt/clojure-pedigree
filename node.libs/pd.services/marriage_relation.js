'use strict';

const send = require('./util.js').send;


function* findPartnerNodes (personNodeId, logTrace) {
  const body = {personNodeId};
  return yield send('marriageRelation', '/find/partners', 'get', body, logTrace);
}

module.exports = {
  findPartnerNodes
};
