var jquery = require('jquery');
var q = require('q');

// Get tree data
// Returns a promise
function getTreeData(page) {
  var config = page.config;
  var rootId = config.getPersonId();
  var url;

  if (!!rootId) {
    url = '/tree/getFromPerson/' + rootId;
  } else {
    url = '/tree/getFromNone';
  }

  return q.Promise(function(resolve, reject){
    jquery.ajax({
      type: 'GET',
      url: url,
      success: function(data) {
        page.root = data;
        resolve(data);
      }
    });
  });
}
exports.getTreeData = getTreeData;
