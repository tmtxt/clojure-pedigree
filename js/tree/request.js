var jquery = require('jquery');
var q = require('q');

// Get tree data
// Returns a promise
function getTreeData(page) {
  return q.Promise(function(resolve, reject){
    jquery.ajax({
      type: 'GET',
      url: '/tree/get',
      success: function(data) {
        page.treeData = data;
        resolve(data);
      }
    });
  });
}
exports.getTreeData = getTreeData;
