// Libs
var React = require('react');
var flux = require("flux");

// Data
var statuses = window.statuses;
var genders = window.genders;
var parent = window.parent;
var partner = window.partner;
var child = window.child;
var findPersonList = window.findPersonList;
var fromPerson = window.fromPerson;
var action = window.formAction;

// Global Object
var global = require('./global.js').init({
  fromPerson: fromPerson
});

// Store
var formStore = require('./form_store.js');
var pictureStore = require('./picture_store.js');
var parentStore = require('./parent_store.js');
var familyStore = require('./family_store.js');
var childStore = require('./child_store.js');
global.stores.form = formStore;
global.stores.picture = pictureStore;
global.stores.parent = parentStore;
global.stores.family = familyStore;
global.stores.child = childStore;

// Actions
var pictureAction = require('./picture_action.js');
var parentAction = require('./parent_action.js');
var familyAction = require('./family_action.js');
var findPersonAction = require('./find_person_action.js');
global.actions.picture = pictureAction;
global.actions.parent = parentAction;
global.actions.family = familyAction;
global.actions.findPerson = findPersonAction;

// Init
formStore.init({
  action: action,
  fromPerson: fromPerson
});
pictureStore.init();
parentStore.init({
  parent: parent
});
familyStore.init({
  partner: partner
});
childStore.init({
  child: child
});

pictureAction.init();
parentAction.init();
familyAction.init();
findPersonAction.init();

// Components
var MainView = require('./main_view.jsx');

// Start rendering
React.render(
  React.createElement(MainView,
                      {statuses: statuses,
                       genders: genders,
                       parent: parent}),
  document.getElementById('js-editperson-container')
);
