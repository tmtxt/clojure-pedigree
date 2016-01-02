// libs
var fs = require('fs');

function readQuery(query) {
  return fs.readFileSync(__dirname + '/' + query + '.cyp', 'utf-8');
}

var queries = new Map();
queries.set('findPartners', readQuery('find_partners'));
queries.set('findParents', readQuery('find_parents'));

module.exports = queries;
