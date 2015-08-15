var jquery = require('jquery');

// get tree data
function getTreeData() {
  jquery.ajax({
    type: 'GET',
    url: '/tree/get',
    success: function(data) {
      console.log(data);
    }
  });
}
exports.getTreeData = getTreeData;
