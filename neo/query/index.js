// libs
var fs = require('fs');

function readQuery(query) {
  return fs.readFileSync(__dirname + '/' + query + '.cyp', 'utf-8');
}

var queries = {};
queries.findPartner = readQuery('find_partner');

module.exports = queries;
