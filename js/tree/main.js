var Request = require('./request.js');
var Config = require('./config.js');
var Init = require('./init.js');
var Render = require('./render.js');
var Marriage = require('./marriage.js');
var Depth = require('./depth.js');

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

  // link height
  var linkHeight = opts.linkHeight || config.getLinkHeight();
  config.setLinkHeight(linkHeight);
}

// Start the rendering
function startRender(opts) {
  // transform options to config
  setConfig(opts);

  // start the process
  Marriage.init(page);
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
