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

// Options to Config
function setConfig(opts) {
  var config = page.config;

  // options
  opts = opts || {};

  // show detail modal
  var showDetailModal = opts.showDetailModal || false;
  config.setShowDetailModal(showDetailModal);
}

// Start the rendering
function startRender(opts) {
  // transform options to config
  setConfig(opts);

  // start the process
  Init.init(page)
    .then(function(){
      return Request.getTreeData(page);
    })
    .then(function(){
      return Render.render(page);
    }, function(e){
      console.log(e);
    });
}
exports.startRender = startRender;
