// Global Actions
var actions = {
  PictureAction: null
};
module.exports = actions;

// Init Functions
actions.init = function(opts, global) {
  // Assign
  this.PictureAction = require('./picture_action.js');

  // Init
  this.PictureAction.init(opts, global);
};
