// libs
var jquery = require('jquery');
var config = require('./config.js');

// elements
var updateDepthButton = jquery('.js-update-tree-depth');
var treeDepthInput = jquery('.js-tree-depth-input');

// on update depth
updateDepthButton.click(function(){
  var depth;
  depth = treeDepthInput.val();
  depth = parseInt(depth);

  var personId = config.getPersonId();

  if (!isNaN(depth)) {
    if (!!personId) {
      window.location.replace('/tree/view/person/' + personId + '/depth/' + depth);
    } else {
      window.location.replace('/tree/view/depth/' + depth);
    }
  }
});
