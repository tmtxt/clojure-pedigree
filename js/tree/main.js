var Request = require('./request.js');
var Config = require('./config.js');
var Init = require('./init.js');
var Render = require('./render.js');

// Global page object
var page = {
  config: null,
  treeLayout: null,
  diagonal: null,
  rootSvg: null,
  treeData: null
};
page.config = Config;

Init.init(page)
  .then(function(){
    return Request.getTreeData(page);
  })
  .then(function(){
    return Render.render(page);
  }, function(e){
    console.log(e);
  });
