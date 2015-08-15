var Request = require('./request.js');
var Config = require('./config.js');
var Init = require('./init.js');

// Global page object
var page = {
  config: null,
  treeLayout: null,
  diagonal: null,
  rootSvg: null
};
page.config = Config;

Init
  .init(page)
  .then(Request.getTreeData)
  .then(function(data){
    console.log(data);
  });
