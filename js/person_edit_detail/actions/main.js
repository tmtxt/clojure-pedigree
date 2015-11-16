// Global Actions
var actions = {
  PictureAction: null,
  ParentAction: null,
  FindPersonAction: null
};
module.exports = actions;

// Init Functions
actions.init = function(opts, global) {
  // Assign
  this.PictureAction = require('./picture_action.js');
  this.ParentAction = require('./parent_action.js');
  this.FindPersonAction = require('./find_person_action.js');

  // Init
  this.PictureAction.init(opts, global);
  this.ParentAction.init(opts, global);
  this.FindPersonAction.init(opts, global);
};
