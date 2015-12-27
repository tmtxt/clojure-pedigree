var jquery = require('jquery');
var Request = require('tree/request.js');

var config = {};
config.getPersonId = function() {
  return 1;
};
config.getTreeDepth = function() {
  return 5;
};

var page = {};
page.config = config;

var exportButton = jquery('.js-export-tree');
exportButton.click(function(){
  Request.getTreeData(page).then(function(data){
    console.log(data);
  });
});
