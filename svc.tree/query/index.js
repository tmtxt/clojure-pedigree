var fs = require('fs');

function readQuery(query) {
  return fs.readFileSync(__dirname + '/' + query + '.cyp', 'utf-8');
}

module.exports = {
  getTree: readQuery('get_tree')
};
