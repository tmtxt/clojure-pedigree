var jquery = require('jquery');
var q = require('q');

// Get tree data
// Returns a promise
function getTreeData(page) {
  var config = page.config;
  var rootId = config.getPersonId();
  var treeDepth = config.getTreeDepth();
  var url = "/tree/data";

  return q.Promise(function(resolve, reject){
    jquery.ajax({
      type: 'GET',
      data: {
        personId: rootId,
        depth: treeDepth
      },
      url: url,
      success: function(data) {
        page.root = data;
        resolve(data);
      }
    });
  });
}
exports.getTreeData = getTreeData;
