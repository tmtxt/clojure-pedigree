(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./person_edit_detail/main.js');

},{"./person_edit_detail/main.js":7}],2:[function(require,module,exports){
////////////////////////////////////////////////////////////////////////////////
// Libs
var jquery = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var q = (typeof window !== "undefined" ? window['Q'] : typeof global !== "undefined" ? global['Q'] : null);

var global;
var stores;

function init(opts, gbl) {
  global = gbl;
  stores = global.stores;
}

// Picture action
var action = {
  init: init,
  selectPerson: selectPerson
};
module.exports = action;

// Components
var findPersonModal = jquery('.js-find-person-modal');
var selectBoxContainer = jquery('.js-select-person-container');
var selectPersonButton = jquery('.js-confirm-select-person-button');

////////////////////////////////////////////////////////////////////////////////
// Functions
function createSelectBox() {
  selectBoxContainer.empty();
  var selectBox = document.createElement('select');
  selectBox = jquery(selectBox);
  selectBox.addClass('js-find-person-select');
  selectBox.css('width', '100%');
  selectBoxContainer.append(selectBox);
  return selectBox;
}

function createTemplateResult(person) {
  if (!!person.id) {
    var div  = document.createElement('div');
    div = jquery(div);
    div.addClass('findperson-result-item');
    var imgDiv  = document.createElement('div');
    imgDiv = jquery(imgDiv);
    imgDiv.addClass('img-rounded');
    var img = document.createElement('img');
    img = jquery(img);
    img.attr('src', person.picture);
    img.addClass('img-responsive');
    var span = document.createElement('span');
    span = jquery(span);
    span.html(person['full-name']);

    imgDiv.append(img);
    div.append(imgDiv);
    div.append(span);

    return div;
  }

  return "";
}

function createTemplateSelection(person) {
  if (!!person.id) {
    var div  = document.createElement('div');
    div = jquery(div);
    div.addClass('findperson-selected-item');
    var imgDiv  = document.createElement('div');
    imgDiv = jquery(imgDiv);
    imgDiv.addClass('img-rounded');
    var img = document.createElement('img');
    img = jquery(img);
    img.attr('src', person.picture);
    img.addClass('img-responsive');
    var span = document.createElement('span');
    span = jquery(span);
    span.html(person['full-name']);

    imgDiv.append(img);
    div.append(imgDiv);
    div.append(span);

    return div;
  }

  return "Type name to select";
}

// Select person with modal
// Returns a promise, resolve when finish selection, reject when not select
function selectPerson(data) {
  return q.Promise(function(resolve, reject){
    function makeData(params) {
      if(!!params.term) {
        data.term = params.term;
      }
      return data;
    }

    function processResults(data, page) {
      return {
        results: data
      };
    }

    var ajax = {
      url: '/person/find/list/simple',
      data: makeData,
      dataType: 'json',
      delay: 250,
      processResults: processResults
    };

    var selectedPerson;

    var selectBox = createSelectBox();
    selectBox.select2({
      ajax: ajax,
      placeholder: 'Select',
      templateResult: createTemplateResult,
      templateSelection: createTemplateSelection
    });
    selectBox.on('select2:select', function(e){
      selectedPerson = e.params.data;
    });
    selectBox.on('select2:unselect', function(e){
      selectedPerson = null;
    });

    unbindModal();
    findPersonModal.on('hide.bs.modal', function(){
      reject();
    });
    selectPersonButton.click(function(){
      unbindModal();
      findPersonModal.modal('hide');
      if(!!selectedPerson) {
        resolve(selectedPerson);
      } else {
        reject();
      }
    });
    findPersonModal.modal('show');
  });
}

function unbindModal() {
  findPersonModal.unbind();
  selectPersonButton.unbind();
}

},{}],3:[function(require,module,exports){
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

},{"./find_person_action.js":2,"./parent_action.js":4,"./picture_action.js":5}],4:[function(require,module,exports){
////////////////////////////////////////////////////////////////////////////////
// Libs
var jquery = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var q = (typeof window !== "undefined" ? window['Q'] : typeof global !== "undefined" ? global['Q'] : null);

var global;
var stores;
var ParentStore;
var FindPersonAction;

function init(opts, gbl) {
  global = gbl;
  stores = global.stores;
  ParentStore = stores.ParentStore;
  FindPersonAction = global.actions.FindPersonAction;
}

// Picture action
var action = {
  init: init
};
module.exports = action;

////////////////////////////////////////////////////////////////////////////////
// Select Functions
action.selectFather = function() {
  var data = {};
  if(ParentStore.isMotherSelected()) {
    data = {
      parentId: ParentStore.getMother().id
    };
  } else {
    data = {
      parentRole: 'father'
    };
  }
  FindPersonAction.selectPerson(data).then(function(person){
    ParentStore.setFather(person);
  });
};

action.selectMother = function() {
  var data = {};
  if(ParentStore.isFatherSelected()) {
    data = {
      parentId: ParentStore.getFather().id
    };
  } else {
    data = {
      parentRole: 'mother'
    };
  }
  FindPersonAction.selectPerson(data).then(function(person){
    ParentStore.setMother(person);
  });
};

////////////////////////////////////////////////////////////////////////////////
// Remove Functions
action.removeMother = function() {
  ParentStore.removeMother();
};

action.removeFather = function() {
  ParentStore.removeFather();
};

},{}],5:[function(require,module,exports){
////////////////////////////////////////////////////////////////////////////////
// Libs
var jquery = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var q = (typeof window !== "undefined" ? window['Q'] : typeof global !== "undefined" ? global['Q'] : null);

var global;
var stores;
var PersonStore;

function init(opts, gbl) {
  global = gbl;
  stores = global.stores;
  PersonStore = stores.PersonStore;
}

// Picture action
var action = {
  init: init
};
module.exports = action;

////////////////////////////////////////////////////////////////////////////////
// open file input selection for user to select an image
// Returns a promise, resolve with the image link if selected
// reject otherwise
function selectFile() {
  return q.Promise(function(resolve, reject){
    // find the picture input
    var pictureInput = jquery(".js-picture-input");
    // remove all event listeners
    pictureInput.unbind();
    // new event handler
    pictureInput.change(function(){
      var file = pictureInput[0].files[0];
      if(!!file) {
        if(!!window.URL.createObjectURL) {
          var imageLink = window.URL.createObjectURL(file);
          resolve(imageLink);
        } else {
          reject();
        }
      } else {
        // not select
        reject();
      }
    });
    // trigger selection
    pictureInput.trigger("click");
  });
}

// Select picture
action.selectPicture = function() {
  selectFile().then(function(url){
    PersonStore.setPicture(url);
  });
};

////////////////////////////////////////////////////////////////////////////////
// Remove picture
action.removePicture = function() {
  PersonStore.removePicture();
};

},{}],6:[function(require,module,exports){
////////////////////////////////////////////////////////////////////////////////
// Const
var ACTION_ADD = "add";
var ACTION_EDIT = "edit";
var FROM_PARENT = "parent";
var FROM_PARTNER = "partner";
var FROM_CHILD = "child";
var FROM_NONE = "none";
var FROM_HUSBAND = "husband";
var FROM_WIFE = "wife";
var FROM_FATHER = "father";
var FROM_MOTHER = "mother";

////////////////////////////////////////////////////////////////////////////////
// Global Config
var config = {
  actionLink: null,
  fromPerson: null,
  fromPartner: null,
  fromParent: null,
  statusesList: null,
  gendersList: null
};
module.exports = config;

////////////////////////////////////////////////////////////////////////////////
// Init Functions
config.init = function(opts, global) {
  this.initAction(opts);
  this.initDisplayData(opts);
};

config.initDisplayData = function(opts) {
  this.statusesList = opts.statusesList;
  this.gendersList = opts.gendersList;
};

config.initAction = function(opts) {
  var action = opts.action;

  if (action === ACTION_ADD) {
    this.action = ACTION_ADD;
    this.actionLink = "/person/add/process";
    this.initAddPage(opts);
  } else {
    this.action = ACTION_EDIT;
    this.actionLink = "/person/editProcess";
    this.initEditPage(opts);
  }
};

config.initAddPage = function(opts) {
  var fromPerson = opts.fromPerson;

  switch(fromPerson) {
  case FROM_PARENT:
    this.initAddFromParent(opts);
    break;
  case FROM_PARTNER:
    this.initAddFromPartner(opts);
    break;
  case FROM_CHILD:
    break;
  default:
    fromPerson = FROM_NONE;
  }

  this.fromPerson = fromPerson;
};

config.initAddFromParent = function(opts) {
  var parent = opts.parent;
  if (!!parent.father) {
    this.fromParent = FROM_FATHER;
  } else {
    this.fromParent = FROM_MOTHER;
  }
};

config.initAddFromPartner = function(opts) {
  var partner = opts.partner;

  if(!!partner) {
    if(!!partner.husband) {
      this.fromPartner = FROM_HUSBAND;
    } else {
      this.fromPartner = FROM_WIFE;
    }
  }
};

config.initEditPage = function(opts) {

};

////////////////////////////////////////////////////////////////////////////////
// Get Functions
config.getFormActionLink = function() {
  return this.actionLink;
};

config.getFromPerson = function() {
  return this.fromPerson;
};

config.getStatusesList = function() {
  return this.statusesList;
};

config.getGendersList = function() {
  return this.gendersList;
};

////////////////////////////////////////////////////////////////////////////////
// Predicate Functions
config.isAddPage = function() {
  return this.action === ACTION_ADD;
};

config.isEditPage = function() {
  return this.action === ACTION_EDIT;
};

config.isFromParent = function() {
  return this.fromPerson === FROM_PARENT;
};

config.isFromPartner = function() {
  return this.fromPerson === FROM_PARTNER;
};

config.isFromChild = function() {
  return this.fromPerson === FROM_CHILD;
};

config.isFromNone = function() {
  return this.fromPerson === FROM_NONE;
};

config.isFromHusband = function() {
  return this.fromPartner === FROM_HUSBAND;
};

config.isFromWife = function() {
  return this.fromPartner === FROM_WIFE;
};

config.isFromFather = function() {
  return this.fromParent === FROM_FATHER;
};

config.isFromMother = function() {
  return this.fromParent === FROM_MOTHER;
};

},{}],7:[function(require,module,exports){
// Libs
var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var flux = (typeof window !== "undefined" ? window['Flux'] : typeof global !== "undefined" ? global['Flux'] : null);

// Data
var statuses = window.statuses;
var genders = window.genders;
var parent = window.parent;
var partner = window.partner;
var child = window.child;
var person = window.person;
var findPersonList = window.findPersonList;
var fromPerson = window.fromPerson;
var action = window.formAction;

var global = {};

var config = require('./config.js');
global.config = config;
config.init({
  action: action,
  fromPerson: fromPerson,
  statusesList: statuses,
  gendersList: genders,
  partner: partner,
  parent: parent
}, global);

var stores = require('./stores/main.js');
global.stores = stores;
stores.init({
  child: child,
  partner: partner,
  parent: parent,
  person: person
}, global);

var actions = require('./actions/main.js');
global.actions = actions;
actions.init({}, global);

var util = require('./util.js');
global.util = util;

// Render
var MainView = require('./views/main_view.jsx')(global);
React.render(
  React.createElement(MainView, {}),
  document.getElementById('js-editperson-container')
);

},{"./actions/main.js":3,"./config.js":6,"./stores/main.js":9,"./util.js":14,"./views/main_view.jsx":19}],8:[function(require,module,exports){
// Libs
var util = require('./util.js');

function init(opts) {
  var child = opts.child;

  if(!!child) {
    child = util.normalizePerson(child);
  }
  this.child = child;

  return this;
}

function getChild() {
  return this.child;
}

// Child Store
var store = {
  // data
  child: null,

  // funcs
  init: init,
  getChild: getChild
};
module.exports = store;

},{"./util.js":13}],9:[function(require,module,exports){
// Global Stores
var stores = {
  ChildStore: null,
  PartnerStore: null,
  ParentStore: null,
  PersonStore: null
};
module.exports = stores;

// Init Functions
stores.init = function(opts, global) {
  // Assign
  var config = global.config;
  this.ChildStore = require('./child_store.js');
  this.PartnerStore = require('./partner_store.js');
  this.ParentStore = require('./parent_store.js');
  this.PersonStore = require('./person_store.js');

  // init
  this.PersonStore.init(opts);
  if (config.isFromChild()) {
    this.ChildStore.init(opts);
  }
  if (config.isFromPartner()) {
    this.PartnerStore.init(opts);
  }
  if (config.isFromParent()) {
    this.ParentStore.init(opts);
  }
};

},{"./child_store.js":8,"./parent_store.js":10,"./partner_store.js":11,"./person_store.js":12}],10:[function(require,module,exports){
(function (global){
// Libs
var microEvent = (typeof window !== "undefined" ? window['MicroEvent'] : typeof global !== "undefined" ? global['MicroEvent'] : null);
var util = require('./util.js');

//
function init(opts) {
  var parent = opts.parent;
  var father;
  var mother;

  if(!!parent) {
    if(!!parent.father) {
      // add from father
      father = util.normalizePerson(parent.father);
      mother = util.getPerson();
    } else {
      // add from mother
      mother = util.normalizePerson(parent.mother);
      father = util.getPerson();
    }
  } else {
    father = util.getPerson();
    mother = util.getPerson();
  }
  this.father = father;
  this.mother = mother;

  return this;
}

// Parent Store
var store = {
  // data
  father: null,
  mother: null,

  // funcs
  init: init
};
module.exports = store;

microEvent.mixin(store);

// Get Functions
store.getFather = function() {
  return this.father;
};

store.getMother = function() {
  return this.mother;
};

// Set Functions
store.setFather = function(person) {
  person = util.normalizePerson(person);
  this.father = person;
  this.trigger('change');
};

store.setMother = function(person) {
  person = util.normalizePerson(person);
  this.mother = person;
  this.trigger('change');
};

// Remove Functions
store.removeFather = function() {
  var father = util.getPerson();
  this.father = father;
  this.trigger('change');
};

store.removeMother = function() {
  var mother = util.getPerson();
  this.mother = mother;
  this.trigger('change');
};

// Predicate Functions
store.isMotherSelected = function() {
  return this.mother.selected;
};

store.isFatherSelected = function() {
  return this.father.selected;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./util.js":13}],11:[function(require,module,exports){
// Libs
var util = require('./util.js');

function init(opts) {
  var partner = opts.partner;
  var person;

  if(!!partner.husband) {
    person = partner.husband;
  } else {
    person = partner.wife;
  }
  person = util.normalizePerson(person);
  person.canRemove = false;
  this.partner = person;

  return this;
}

// Partner Store
var store = {
  // data
  partner: null,

  // funcs
  init: init
};
module.exports = store;

store.getPartner = function() {
  return this.partner;
};

},{"./util.js":13}],12:[function(require,module,exports){
(function (global){
// Libs
var util = require('./util.js');
var microEvent = (typeof window !== "undefined" ? window['MicroEvent'] : typeof global !== "undefined" ? global['MicroEvent'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

function init(opts) {
  var person = opts.person;

  if (!!person && !_.isEmpty(person)) {
    person = util.normalizePerson(person);
  } else {
    person = util.getPerson();
    person.fullName = "";
  }
  this.person = person;

  return this;
}

// Person Store
var store = {
  // data
  person: null,

  // funcs
  init: init
};
module.exports = store;

// Get Functions
store.getPerson = function() {
  return this.person;
};

// Update Functions
store.setPicture = function(link) {
  this.person.picture = link;
  this.trigger('change');
};

store.removePicture = function() {
  this.person.picture = "/assets/img/userbasic.jpg";
  this.trigger('change');
};

store.setAliveStatus = function(status) {
  this.person.aliveStatus = status;
  this.trigger('change');
};

microEvent.mixin(store);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./util.js":13}],13:[function(require,module,exports){
function getPerson() {
  return {
    id: null,
    fullName: "Not selected",
    picture: "/assets/img/userbasic.jpg",
    address: null,
    phoneNo: null,
    summary: null,
    gender: null,
    aliveStatus: null,
    birthDate: null,
    deathDate: null,
    createdAt: null,
    job: null,

    selected: false,
    canRemove: true
  };
}
exports.getPerson = getPerson;

function normalizePerson(person) {
  var fullName = person.fullName || person.full_name || person['full-name'];
  var phoneNo = person.phoneNo || person.phone_no || person['phone-no'];
  var deathDate = person.deathDate || person.death_date || person['death-date'];
  var birthDate = person.birthDate || person.birth_date || person['birth-date'];
  var createdAt = person.createdAt || person.created_at || person['created-at'];
  var aliveStatus = person.aliveStatus || person.alive_status || person['alive-status'];

  return {
    id: person.id,
    fullName: fullName,
    picture: person.picture,
    selected: true,
    canRemove: false,
    phoneNo: phoneNo,
    deathDate: deathDate,
    birthDate: birthDate,
    createdAt: createdAt,
    address: person.address,
    summary: person.summary,
    gender: person.gender,
    aliveStatus: aliveStatus,
    job: person.job
  };
}
exports.normalizePerson = normalizePerson;

},{}],14:[function(require,module,exports){
(function (global){
// Libs
var jquery = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

function initDatePicker() {
  // Find components
  var birthDateInput = jquery('.js-birthdate-input');
  var deathDateInput = jquery('.js-deathdate-input');

  birthDateInput.datepicker({
    language: 'vi'
  });
  deathDateInput.datepicker({
    language: 'vi'
  });
}
exports.initDatePicker = initDatePicker;

function initSummaryEditor() {
  var historyEditor = jquery(".js-history-editor");
  historyEditor.markdown({
    iconlibrary: "fa",
    resize: "vertical",
    height: 300
  });
}
exports.initSummaryEditor = initSummaryEditor;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],15:[function(require,module,exports){
// Libs
var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

// Application Data
var global;
var config;
var ChildStore;

// View class
var ChildView = React.createClass({displayName: "ChildView",
  getInitialState: function() {
    return {
      child: ChildStore.getChild()
    };
  },

  render: function() {
    return (
      React.createElement("div", {className: "family-container"}, 
        React.createElement("input", {name: "childId", type: "hidden", value: this.state.child.id}), 
        React.createElement("div", {className: "family-title"}, 
          "Child"
        ), 
        React.createElement("div", {className: "family-help"}, 
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit"
        ), 
        React.createElement("div", {className: "family-body"}, 
          React.createElement("div", {className: "family-list"}, 
            React.createElement("ul", {className: "partner-list"}, 
              React.createElement("li", null, 
                React.createElement("div", {className: "partner-image people-image"}, 
                  React.createElement("img", {className: "img-responsive img-rounded", alt: "", src: this.state.child.picture})
                ), 
                React.createElement("div", {className: "partner-info people-info"}, 
                  React.createElement("div", {className: "partner-name people-name"}, 
                    this.state.child.fullName
                  )
                )
              )
            )
          )
        )
      )
    );
  }
});

module.exports = function(gbl) {
  // Init application data
  global = gbl;
  config = global.config;
  ChildStore = global.stores.ChildStore;

  return ChildView;
};

},{}],16:[function(require,module,exports){
// Libs
var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

// Application Data
var global;
var config;
var PersonStore;
var PictureAction;

// View class
var Col1View = React.createClass({displayName: "Col1View",
  getInitialState: function() {
    return {
      imageLink: PersonStore.getPerson().picture
    };
  },

  componentDidMount: function() {
    PersonStore.bind("change", this.pictureChanged);
  },

  componentWillUnmount: function() {
    PersonStore.unbind("change", this.pictureChanged);
  },

  pictureChanged: function() {
    this.setState({
      imageLink: PersonStore.getPerson().picture
    });
  },

  handleSelectImage: function(e) {
    e.preventDefault();
    PictureAction.selectPicture();
  },

  handleDeleteImage: function(e) {
    e.preventDefault();
    PictureAction.removePicture();
  },

  render: function() {
    return (
      React.createElement("div", {className: "editperson-col-1"}, 
        React.createElement("div", {className: "col-1-img"}, 
          React.createElement("img", {className: "img-responsive img-thumbnail", alt: "", src: this.state.imageLink}), 
          React.createElement("input", {ref: "pictureInput", name: "picture", 
                 type: "file", accept: "image/*", className: "hidden js-picture-input"})
        ), 
        React.createElement("div", {className: "col-1-buttons"}, 
          React.createElement("button", {onClick: this.handleSelectImage, 
                  className: "btn btn-success"}, "Select"), 
          React.createElement("button", {onClick: this.handleDeleteImage, className: "btn btn-danger"}, "Delete")
        )
      )
    );
  }
});

module.exports = function(gbl) {
  // Init application data
  global = gbl;
  config = global.config;
  PersonStore = global.stores.PersonStore;
  PictureAction = global.actions.PictureAction;

  return Col1View;
};

},{}],17:[function(require,module,exports){
// Libs
var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

// Application Data
var global;
var stores;
var config;
var util;
var PersonStore;

// View class
var Col2View = React.createClass({displayName: "Col2View",
  getInitialState: function() {
    return {
      person: PersonStore.getPerson()
    };
  },

  componentDidMount: function() {
    PersonStore.bind("change", this.personChanged);
    util.initDatePicker();
    util.initSummaryEditor();
  },

  componentWillUnmount: function() {
    PersonStore.unbind("change", this.personChanged);
  },

  handleStatusChange: function(e) {
    var status = React.findDOMNode(this.refs.statuses).value.trim();
    PersonStore.setAliveStatus(status);
  },

  personChanged: function() {
    this.setState({person: PersonStore.getPerson()});
  },

  renderStatuses: function() {
    var statuses = _.map(config.getStatusesList(), function(v, k){
      return (
        React.createElement("option", {key: k, value: k}, v)
      );
    });

    return (
      React.createElement("select", {name: "status", className: "form-control", 
              defaultValue: this.state.person.aliveStatus, 
              ref: "statuses", onChange: this.handleStatusChange}, 
        statuses
      )
    );
  },

  renderGenders: function() {
    var genders = _.map(config.getGendersList(), function(v, k){
      return (
        React.createElement("option", {key: k, value: k}, v)
      );
    });

    return (
      React.createElement("select", {className: "form-control", 
              defaultValue: this.state.person.gender, 
              name: "gender"}, 
        genders
      )
    );
  },

  render: function() {
    var statusesView = this.renderStatuses();
    var gendersView = this.renderGenders();

    return (
      React.createElement("div", {className: "editperson-col-2"}, 
        React.createElement("input", {name: "personid", type: "hidden", value: this.state.person.id}), 
        React.createElement("div", {className: "profile-container"}, 
          React.createElement("div", {className: "profile-header"}, 
            "Hồ sơ"
          ), 

          React.createElement("div", {className: "profile-body"}, 
            React.createElement("div", {className: "profile-body-row"}, 
              React.createElement("div", {className: "profile-body-left"}, 
                "Tên"
              ), 
              React.createElement("div", {className: "profile-body-right"}, 
                React.createElement("input", {className: "form-control", name: "name", type: "text", defaultValue: this.state.person.fullName})
              )
            ), 

            React.createElement("div", {className: "profile-body-row"}, 
              React.createElement("div", {className: "profile-body-left"}, 
                "Ngày sinh"
              ), 
              React.createElement("div", {className: "profile-body-right"}, 
                React.createElement("input", {className: "form-control js-birthdate-input", 
                       defaultValue: this.state.person.birthDate, 
                       name: "birthdate", type: "text"})
              )
            ), 

            React.createElement("div", {className: "profile-body-row"}, 
              React.createElement("div", {className: "profile-body-left"}, 
                "Tình trạng"
              ), 
              React.createElement("div", {className: "profile-body-right"}, 
                statusesView
              )
            ), 

            React.createElement("div", {className: (this.state.person.aliveStatus === "dead" ? '' : 'hidden ') + "profile-body-row"}, 
              React.createElement("div", {className: "profile-body-left"}, 
                "Ngày mất"
              ), 
              React.createElement("div", {className: "profile-body-right"}, 
                React.createElement("input", {className: "form-control js-deathdate-input", 
                       defaultValue: this.state.person.deathDate, 
                       name: "deathdate", type: "text"})
              )
            ), 

            React.createElement("div", {className: "profile-body-row"}, 
              React.createElement("div", {className: "profile-body-left"}, 
                "Giới tính"
              ), 
              React.createElement("div", {className: "profile-body-right"}, 
                gendersView
              )
            ), 

            React.createElement("div", {className: "profile-body-row"}, 
              React.createElement("div", {className: "profile-body-left"}, 
                "Điện thoại"
              ), 
              React.createElement("div", {className: "profile-body-right"}, 
                React.createElement("input", {className: "form-control", name: "phone", type: "text", defaultValue: this.state.person.phoneNo})
              )
            ), 

            React.createElement("div", {className: "profile-body-row"}, 
              React.createElement("div", {className: "profile-body-left"}, 
                "Địa chỉ"
              ), 
              React.createElement("div", {className: "profile-body-right"}, 
                React.createElement("textarea", {className: "form-control", cols: "30", id: "", 
                          defaultValue: this.state.person.address, 
                          name: "address", rows: "3"})
              )
            )

          )
        ), 

        React.createElement("div", {className: "history-container"}, 
          React.createElement("div", {className: "history-header"}, 
            "Tiểu sử"
          ), 
          React.createElement("div", {className: "history-body"}, 
            React.createElement("textarea", {name: "history", defaultValue: this.state.person.summary, 
                      className: "form-control js-history-editor"})
          )
        )
      )
    );
  }
});

module.exports = function(gbl) {
  // Init application data
  global = gbl;
  stores = global.stores;
  config = global.config;
  util = global.util;
  PersonStore = stores.PersonStore;

  return Col2View;
};

},{}],18:[function(require,module,exports){
// Libs
var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

// Application Data
var global;
var config;

// Sub views
var ParentView;
var PartnerView;
var ChildView;

// View Class
var Col3View = React.createClass({displayName: "Col3View",
  renderParentView: function() {
    if (config.isFromParent()) {
      return (
        React.createElement(ParentView, null)
      );
    }
    return null;
  },

  renderPartnerView: function() {
    if (config.isFromPartner()) {
      return (
        React.createElement(PartnerView, null)
      );
    }
    return null;
  },

  renderChildView: function() {
    if (config.isFromChild()) {
      return (
        React.createElement(ChildView, null)
      );
    }
    return null;
  },

  render: function() {
    var parentView = this.renderParentView();
    var partnerView = this.renderPartnerView();
    var childView = this.renderChildView();

    return (
      React.createElement("div", {className: "editperson-col-3"}, 
        parentView, 
        partnerView, 
        childView
      )
    );
  }
});

module.exports = function(gbl) {
  // Init application data
  global = gbl;
  config = global.config;

  // Init sub views
  ParentView = require("./parent_view.jsx")(gbl);
  PartnerView = require("./partner_view.jsx")(gbl);
  ChildView = require("./child_view.jsx")(gbl);

  return Col3View;
};

},{"./child_view.jsx":15,"./parent_view.jsx":20,"./partner_view.jsx":21}],19:[function(require,module,exports){
// Libs
var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

// Application Data
var global;
var stores;
var config;

// Sub views
var Col1View;
var Col2View;
var Col3View;

// Main View class
var MainView = React.createClass({displayName: "MainView",
  getInitialState: function() {
    return {};
  },

  renderCol1: function() {
    return (
      React.createElement(Col1View, null)
    );
  },

  renderCol2: function() {
    return (
      React.createElement(Col2View, null)
    );
  },

  renderCol3: function() {
    if (config.isEditPage()) {
      return null;
    } else {
      return (
        React.createElement(Col3View, null)
      );
    }
  },

  render: function() {
    var col1 = this.renderCol1();
    var col2 = this.renderCol2();
    var col3 = this.renderCol3();

    return (
      React.createElement("div", null, 
        React.createElement("form", {action: config.getFormActionLink(), method: "post", encType: "multipart/form-data"}, 
          React.createElement("input", {name: "fromPerson", type: "hidden", value: config.getFromPerson()}), 

          React.createElement("div", {className: "editperson-header"}, 
            React.createElement("div", {className: "editperson-title"}, 
              "Add new person"
            ), 
            React.createElement("div", {className: "editperson-buttons"}, 
              React.createElement("button", {className: "btn btn-success"}, "Submit"), 
              React.createElement("button", {className: "btn btn-danger"}, "Cancel")
            )
          ), 

          React.createElement("div", {className: "editperson-body"}, 
            col1, 
            col2, 
            col3
          )
        )
      )
    );
  }
});

module.exports = function(gbl) {
  // Init application data
  global = gbl;
  stores = global.stores;
  config = global.config;

  // Init Sub views
  Col1View = require("./col_1_view.jsx")(gbl);
  Col2View = require("./col_2_view.jsx")(gbl);
  Col3View = require("./col_3_view.jsx")(gbl);

  return MainView;
};

},{"./col_1_view.jsx":16,"./col_2_view.jsx":17,"./col_3_view.jsx":18}],20:[function(require,module,exports){
// Libs
var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

// Application Data
var global;
var config;
var ParentStore;
var ParentAction;

// View class
var ParentView = React.createClass({displayName: "ParentView",
  getInitialState: function() {
    return {
      father: ParentStore.getFather(),
      mother: ParentStore.getMother()
    };
  },

  componentDidMount: function() {
    ParentStore.bind("change", this.parentChanged);
  },

  componentWillUnmount: function() {
    ParentStore.unbind("change", this.parentChanged);
  },

  parentChanged: function() {
    var parent = {
      father: ParentStore.getFather(),
      mother: ParentStore.getMother()
    };
    this.setState(parent);
  },

  handleRemoveFather: function(e) {
    e.preventDefault();
    ParentAction.removeFather();
  },

  handleRemoveMother: function(e) {
    e.preventDefault();
    ParentAction.removeMother();
  },

  handleSelectMother: function(e) {
    e.preventDefault();
    ParentAction.selectMother();
  },

  handleSelectFather: function(e) {
    e.preventDefault();
    ParentAction.selectFather();
  },

  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("div", {className: "parent-title"}, 
          "Parents"
        ), 
        React.createElement("div", {className: "parent-help"}, 
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt."
        ), 
        React.createElement("div", {className: "parent-body"}, 
          React.createElement("ul", null, 
            React.createElement("li", null, 
              React.createElement("input", {name: "fatherId", type: "hidden", value: this.state.father.id}), 
              React.createElement("div", {className: "parent-image people-image"}, 
                React.createElement("img", {className: "img-responsive img-rounded", alt: "", src: this.state.father.picture})
              ), 
              React.createElement("div", {className: "parent-info people-info"}, 
                React.createElement("div", {className: "parent-name people-name"}, 
                  React.createElement("span", null, "Father: "), 
                  React.createElement("span", null, this.state.father.fullName)
                ), 
                React.createElement("div", {className: !config.isFromFather() ? "" : "hidden"}, 
                  React.createElement("a", {href: "#", onClick: this.handleSelectFather}, "Select"), " ", 
                  React.createElement("a", {href: "#", onClick: this.handleRemoveFather}, "Remove")
                )
              )
            ), 
            React.createElement("li", null, 
              React.createElement("input", {name: "motherId", type: "hidden", value: this.state.mother.id}), 
              React.createElement("div", {className: "parent-image people-image"}, 
                React.createElement("img", {className: "img-responsive img-rounded", alt: "", src: this.state.mother.picture})
              ), 
              React.createElement("div", {className: "parent-info people-info"}, 
                React.createElement("div", {className: "parent-name people-name"}, 
                  React.createElement("span", null, "Mother: "), 
                  React.createElement("span", null, this.state.mother.fullName)
                ), 
                React.createElement("div", {className: !config.isFromMother() ? "" : "hidden"}, 
                  React.createElement("a", {href: "#", onClick: this.handleSelectMother}, "Select"), " ", 
                  React.createElement("a", {href: "#", onClick: this.handleRemoveMother}, "Remove")
                )
              )
            )
          )
        )
      )
    );
  }
});

module.exports = function(gbl) {
  // Init application data
  global = gbl;
  config = global.config;
  ParentStore = global.stores.ParentStore;
  ParentAction = global.actions.ParentAction;

  return ParentView;
};

},{}],21:[function(require,module,exports){
// Libs
var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

// Application Data
var global;
var config;
var PartnerStore;

// View class
var PartnerView = React.createClass({displayName: "PartnerView",
  getInitialState: function() {
    return {
      partner: PartnerStore.getPartner()
    };
  },

  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("div", {className: "family-title"}, 
          "Family"
        ), 
        React.createElement("div", {className: "family-help"}, 
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit"
        ), 
        React.createElement("div", {className: "family-body"}, 
          React.createElement("div", {className: "family-list"}, 
            React.createElement("ul", {className: "partner-list"}, 
              React.createElement("li", null, 
                React.createElement("input", {name: "partnerId", type: "hidden", value: this.state.partner.id}), 
                React.createElement("div", {className: "partner-image people-image"}, 
                  React.createElement("img", {className: "img-responsive img-rounded", alt: "", src: this.state.partner.picture})
                ), 
                React.createElement("div", {className: "partner-info people-info"}, 
                  React.createElement("div", {className: "partner-name people-name"}, 
                    this.state.partner.fullName
                  )
                )
              )
            )
          )
        )
      )
    );
  }
});

module.exports = function(gbl) {
  // Init application data
  global = gbl;
  config = global.config;
  PartnerStore = global.stores.PartnerStore;

  return PartnerView;
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVm9sdW1lcy90bXR4dC9Qcm9qZWN0cy9jbG9qdXJlLXBlZGlncmVlL2pzL3BlcnNvbl9lZGl0X2RldGFpbC5qcyIsIi9Wb2x1bWVzL3RtdHh0L1Byb2plY3RzL2Nsb2p1cmUtcGVkaWdyZWUvanMvcGVyc29uX2VkaXRfZGV0YWlsL2FjdGlvbnMvZmluZF9wZXJzb25fYWN0aW9uLmpzIiwiL1ZvbHVtZXMvdG10eHQvUHJvamVjdHMvY2xvanVyZS1wZWRpZ3JlZS9qcy9wZXJzb25fZWRpdF9kZXRhaWwvYWN0aW9ucy9tYWluLmpzIiwiL1ZvbHVtZXMvdG10eHQvUHJvamVjdHMvY2xvanVyZS1wZWRpZ3JlZS9qcy9wZXJzb25fZWRpdF9kZXRhaWwvYWN0aW9ucy9wYXJlbnRfYWN0aW9uLmpzIiwiL1ZvbHVtZXMvdG10eHQvUHJvamVjdHMvY2xvanVyZS1wZWRpZ3JlZS9qcy9wZXJzb25fZWRpdF9kZXRhaWwvYWN0aW9ucy9waWN0dXJlX2FjdGlvbi5qcyIsIi9Wb2x1bWVzL3RtdHh0L1Byb2plY3RzL2Nsb2p1cmUtcGVkaWdyZWUvanMvcGVyc29uX2VkaXRfZGV0YWlsL2NvbmZpZy5qcyIsIi9Wb2x1bWVzL3RtdHh0L1Byb2plY3RzL2Nsb2p1cmUtcGVkaWdyZWUvanMvcGVyc29uX2VkaXRfZGV0YWlsL21haW4uanMiLCIvVm9sdW1lcy90bXR4dC9Qcm9qZWN0cy9jbG9qdXJlLXBlZGlncmVlL2pzL3BlcnNvbl9lZGl0X2RldGFpbC9zdG9yZXMvY2hpbGRfc3RvcmUuanMiLCIvVm9sdW1lcy90bXR4dC9Qcm9qZWN0cy9jbG9qdXJlLXBlZGlncmVlL2pzL3BlcnNvbl9lZGl0X2RldGFpbC9zdG9yZXMvbWFpbi5qcyIsIi9Wb2x1bWVzL3RtdHh0L1Byb2plY3RzL2Nsb2p1cmUtcGVkaWdyZWUvanMvcGVyc29uX2VkaXRfZGV0YWlsL3N0b3Jlcy9wYXJlbnRfc3RvcmUuanMiLCIvVm9sdW1lcy90bXR4dC9Qcm9qZWN0cy9jbG9qdXJlLXBlZGlncmVlL2pzL3BlcnNvbl9lZGl0X2RldGFpbC9zdG9yZXMvcGFydG5lcl9zdG9yZS5qcyIsIi9Wb2x1bWVzL3RtdHh0L1Byb2plY3RzL2Nsb2p1cmUtcGVkaWdyZWUvanMvcGVyc29uX2VkaXRfZGV0YWlsL3N0b3Jlcy9wZXJzb25fc3RvcmUuanMiLCIvVm9sdW1lcy90bXR4dC9Qcm9qZWN0cy9jbG9qdXJlLXBlZGlncmVlL2pzL3BlcnNvbl9lZGl0X2RldGFpbC9zdG9yZXMvdXRpbC5qcyIsIi9Wb2x1bWVzL3RtdHh0L1Byb2plY3RzL2Nsb2p1cmUtcGVkaWdyZWUvanMvcGVyc29uX2VkaXRfZGV0YWlsL3V0aWwuanMiLCIvVm9sdW1lcy90bXR4dC9Qcm9qZWN0cy9jbG9qdXJlLXBlZGlncmVlL2pzL3BlcnNvbl9lZGl0X2RldGFpbC92aWV3cy9jaGlsZF92aWV3LmpzeCIsIi9Wb2x1bWVzL3RtdHh0L1Byb2plY3RzL2Nsb2p1cmUtcGVkaWdyZWUvanMvcGVyc29uX2VkaXRfZGV0YWlsL3ZpZXdzL2NvbF8xX3ZpZXcuanN4IiwiL1ZvbHVtZXMvdG10eHQvUHJvamVjdHMvY2xvanVyZS1wZWRpZ3JlZS9qcy9wZXJzb25fZWRpdF9kZXRhaWwvdmlld3MvY29sXzJfdmlldy5qc3giLCIvVm9sdW1lcy90bXR4dC9Qcm9qZWN0cy9jbG9qdXJlLXBlZGlncmVlL2pzL3BlcnNvbl9lZGl0X2RldGFpbC92aWV3cy9jb2xfM192aWV3LmpzeCIsIi9Wb2x1bWVzL3RtdHh0L1Byb2plY3RzL2Nsb2p1cmUtcGVkaWdyZWUvanMvcGVyc29uX2VkaXRfZGV0YWlsL3ZpZXdzL21haW5fdmlldy5qc3giLCIvVm9sdW1lcy90bXR4dC9Qcm9qZWN0cy9jbG9qdXJlLXBlZGlncmVlL2pzL3BlcnNvbl9lZGl0X2RldGFpbC92aWV3cy9wYXJlbnRfdmlldy5qc3giLCIvVm9sdW1lcy90bXR4dC9Qcm9qZWN0cy9jbG9qdXJlLXBlZGlncmVlL2pzL3BlcnNvbl9lZGl0X2RldGFpbC92aWV3cy9wYXJ0bmVyX3ZpZXcuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsT0FBTyxDQUFDLDhCQUE4QixDQUFDLENBQUM7OztBQ0F4QyxnRkFBZ0Y7QUFDaEYsT0FBTztBQUNQLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRXJCLElBQUksTUFBTSxDQUFDO0FBQ1gsSUFBSSxNQUFNLENBQUM7O0FBRVgsU0FBUyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtFQUN2QixNQUFNLEdBQUcsR0FBRyxDQUFDO0VBQ2IsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDekIsQ0FBQzs7QUFFRCxpQkFBaUI7QUFDakIsSUFBSSxNQUFNLEdBQUc7RUFDWCxJQUFJLEVBQUUsSUFBSTtFQUNWLFlBQVksRUFBRSxZQUFZO0NBQzNCLENBQUM7QUFDRixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQzs7QUFFeEIsYUFBYTtBQUNiLElBQUksZUFBZSxHQUFHLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ3RELElBQUksa0JBQWtCLEdBQUcsTUFBTSxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDL0QsSUFBSSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsa0NBQWtDLENBQUMsQ0FBQzs7QUFFcEUsZ0ZBQWdGO0FBQ2hGLFlBQVk7QUFDWixTQUFTLGVBQWUsR0FBRztFQUN6QixrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztFQUMzQixJQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0VBQ2pELFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7RUFDOUIsU0FBUyxDQUFDLFFBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0VBQzVDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0VBQy9CLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztFQUNyQyxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDOztBQUVELFNBQVMsb0JBQW9CLENBQUMsTUFBTSxFQUFFO0VBQ3BDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUU7SUFDZixJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3pDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEIsR0FBRyxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0lBQ3ZDLElBQUksTUFBTSxJQUFJLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN4QixNQUFNLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQy9CLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNsQixHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDaEMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQy9CLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDMUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4QixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7O0lBRS9CLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbkIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN2QixJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7O0lBRWpCLE9BQU8sR0FBRyxDQUFDO0FBQ2YsR0FBRzs7RUFFRCxPQUFPLEVBQUUsQ0FBQztBQUNaLENBQUM7O0FBRUQsU0FBUyx1QkFBdUIsQ0FBQyxNQUFNLEVBQUU7RUFDdkMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRTtJQUNmLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDekMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNsQixHQUFHLENBQUMsUUFBUSxDQUFDLDBCQUEwQixDQUFDLENBQUM7SUFDekMsSUFBSSxNQUFNLElBQUksUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1QyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3hCLE1BQU0sQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDL0IsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4QyxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2xCLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNoQyxHQUFHLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDL0IsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMxQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3hCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQzs7SUFFL0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNuQixHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZCLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7SUFFakIsT0FBTyxHQUFHLENBQUM7QUFDZixHQUFHOztFQUVELE9BQU8scUJBQXFCLENBQUM7QUFDL0IsQ0FBQzs7QUFFRCwyQkFBMkI7QUFDM0IsMkVBQTJFO0FBQzNFLFNBQVMsWUFBWSxDQUFDLElBQUksRUFBRTtFQUMxQixPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxPQUFPLEVBQUUsTUFBTSxDQUFDO0lBQ3hDLFNBQVMsUUFBUSxDQUFDLE1BQU0sRUFBRTtNQUN4QixHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO1FBQ2hCLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztPQUN6QjtNQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2xCLEtBQUs7O0lBRUQsU0FBUyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtNQUNsQyxPQUFPO1FBQ0wsT0FBTyxFQUFFLElBQUk7T0FDZCxDQUFDO0FBQ1IsS0FBSzs7SUFFRCxJQUFJLElBQUksR0FBRztNQUNULEdBQUcsRUFBRSwwQkFBMEI7TUFDL0IsSUFBSSxFQUFFLFFBQVE7TUFDZCxRQUFRLEVBQUUsTUFBTTtNQUNoQixLQUFLLEVBQUUsR0FBRztNQUNWLGNBQWMsRUFBRSxjQUFjO0FBQ3BDLEtBQUssQ0FBQzs7QUFFTixJQUFJLElBQUksY0FBYyxDQUFDOztJQUVuQixJQUFJLFNBQVMsR0FBRyxlQUFlLEVBQUUsQ0FBQztJQUNsQyxTQUFTLENBQUMsT0FBTyxDQUFDO01BQ2hCLElBQUksRUFBRSxJQUFJO01BQ1YsV0FBVyxFQUFFLFFBQVE7TUFDckIsY0FBYyxFQUFFLG9CQUFvQjtNQUNwQyxpQkFBaUIsRUFBRSx1QkFBdUI7S0FDM0MsQ0FBQyxDQUFDO0lBQ0gsU0FBUyxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxTQUFTLENBQUMsQ0FBQztNQUN4QyxjQUFjLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7S0FDaEMsQ0FBQyxDQUFDO0lBQ0gsU0FBUyxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxTQUFTLENBQUMsQ0FBQztNQUMxQyxjQUFjLEdBQUcsSUFBSSxDQUFDO0FBQzVCLEtBQUssQ0FBQyxDQUFDOztJQUVILFdBQVcsRUFBRSxDQUFDO0lBQ2QsZUFBZSxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsVUFBVTtNQUM1QyxNQUFNLEVBQUUsQ0FBQztLQUNWLENBQUMsQ0FBQztJQUNILGtCQUFrQixDQUFDLEtBQUssQ0FBQyxVQUFVO01BQ2pDLFdBQVcsRUFBRSxDQUFDO01BQ2QsZUFBZSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztNQUM5QixHQUFHLENBQUMsQ0FBQyxjQUFjLEVBQUU7UUFDbkIsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO09BQ3pCLE1BQU07UUFDTCxNQUFNLEVBQUUsQ0FBQztPQUNWO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsZUFBZSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUMvQixDQUFDLENBQUM7QUFDTCxDQUFDOztBQUVELFNBQVMsV0FBVyxHQUFHO0VBQ3JCLGVBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztFQUN6QixrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQztDQUM3Qjs7O0FDdEpELGlCQUFpQjtBQUNqQixJQUFJLE9BQU8sR0FBRztFQUNaLGFBQWEsRUFBRSxJQUFJO0VBQ25CLFlBQVksRUFBRSxJQUFJO0VBQ2xCLGdCQUFnQixFQUFFLElBQUk7Q0FDdkIsQ0FBQztBQUNGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDOztBQUV6QixpQkFBaUI7QUFDakIsT0FBTyxDQUFDLElBQUksR0FBRyxTQUFTLElBQUksRUFBRSxNQUFNLEVBQUU7O0VBRXBDLElBQUksQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7RUFDcEQsSUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUNwRCxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUM3RDs7RUFFRSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7RUFDdEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0VBQ3JDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0NBQzFDLENBQUM7OztBQ25CRixnRkFBZ0Y7QUFDaEYsT0FBTztBQUNQLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRXJCLElBQUksTUFBTSxDQUFDO0FBQ1gsSUFBSSxNQUFNLENBQUM7QUFDWCxJQUFJLFdBQVcsQ0FBQztBQUNoQixJQUFJLGdCQUFnQixDQUFDOztBQUVyQixTQUFTLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFO0VBQ3ZCLE1BQU0sR0FBRyxHQUFHLENBQUM7RUFDYixNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztFQUN2QixXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztFQUNqQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDO0FBQ3JELENBQUM7O0FBRUQsaUJBQWlCO0FBQ2pCLElBQUksTUFBTSxHQUFHO0VBQ1gsSUFBSSxFQUFFLElBQUk7Q0FDWCxDQUFDO0FBQ0YsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7O0FBRXhCLGdGQUFnRjtBQUNoRixtQkFBbUI7QUFDbkIsTUFBTSxDQUFDLFlBQVksR0FBRyxXQUFXO0VBQy9CLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztFQUNkLEdBQUcsV0FBVyxDQUFDLGdCQUFnQixFQUFFLEVBQUU7SUFDakMsSUFBSSxHQUFHO01BQ0wsUUFBUSxFQUFFLFdBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFO0tBQ3JDLENBQUM7R0FDSCxNQUFNO0lBQ0wsSUFBSSxHQUFHO01BQ0wsVUFBVSxFQUFFLFFBQVE7S0FDckIsQ0FBQztHQUNIO0VBQ0QsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLE1BQU0sQ0FBQztJQUN2RCxXQUFXLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0dBQy9CLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQzs7QUFFRixNQUFNLENBQUMsWUFBWSxHQUFHLFdBQVc7RUFDL0IsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO0VBQ2QsR0FBRyxXQUFXLENBQUMsZ0JBQWdCLEVBQUUsRUFBRTtJQUNqQyxJQUFJLEdBQUc7TUFDTCxRQUFRLEVBQUUsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUU7S0FDckMsQ0FBQztHQUNILE1BQU07SUFDTCxJQUFJLEdBQUc7TUFDTCxVQUFVLEVBQUUsUUFBUTtLQUNyQixDQUFDO0dBQ0g7RUFDRCxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsTUFBTSxDQUFDO0lBQ3ZELFdBQVcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7R0FDL0IsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDOztBQUVGLGdGQUFnRjtBQUNoRixtQkFBbUI7QUFDbkIsTUFBTSxDQUFDLFlBQVksR0FBRyxXQUFXO0VBQy9CLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUM3QixDQUFDLENBQUM7O0FBRUYsTUFBTSxDQUFDLFlBQVksR0FBRyxXQUFXO0VBQy9CLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztDQUM1QixDQUFDOzs7QUNqRUYsZ0ZBQWdGO0FBQ2hGLE9BQU87QUFDUCxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVyQixJQUFJLE1BQU0sQ0FBQztBQUNYLElBQUksTUFBTSxDQUFDO0FBQ1gsSUFBSSxXQUFXLENBQUM7O0FBRWhCLFNBQVMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7RUFDdkIsTUFBTSxHQUFHLEdBQUcsQ0FBQztFQUNiLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0VBQ3ZCLFdBQVcsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO0FBQ25DLENBQUM7O0FBRUQsaUJBQWlCO0FBQ2pCLElBQUksTUFBTSxHQUFHO0VBQ1gsSUFBSSxFQUFFLElBQUk7Q0FDWCxDQUFDO0FBQ0YsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7O0FBRXhCLGdGQUFnRjtBQUNoRix3REFBd0Q7QUFDeEQsNkRBQTZEO0FBQzdELG1CQUFtQjtBQUNuQixTQUFTLFVBQVUsR0FBRztBQUN0QixFQUFFLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLE9BQU8sRUFBRSxNQUFNLENBQUM7O0FBRTVDLElBQUksSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUM7O0FBRW5ELElBQUksWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDOztJQUV0QixZQUFZLENBQUMsTUFBTSxDQUFDLFVBQVU7TUFDNUIsSUFBSSxJQUFJLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUNwQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUU7UUFDVCxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRTtVQUMvQixJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztVQUNqRCxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDcEIsTUFBTTtVQUNMLE1BQU0sRUFBRSxDQUFDO1NBQ1Y7QUFDVCxPQUFPLE1BQU07O1FBRUwsTUFBTSxFQUFFLENBQUM7T0FDVjtBQUNQLEtBQUssQ0FBQyxDQUFDOztJQUVILFlBQVksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7R0FDL0IsQ0FBQyxDQUFDO0FBQ0wsQ0FBQzs7QUFFRCxpQkFBaUI7QUFDakIsTUFBTSxDQUFDLGFBQWEsR0FBRyxXQUFXO0VBQ2hDLFVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQztJQUM3QixXQUFXLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQzdCLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQzs7QUFFRixnRkFBZ0Y7QUFDaEYsaUJBQWlCO0FBQ2pCLE1BQU0sQ0FBQyxhQUFhLEdBQUcsV0FBVztFQUNoQyxXQUFXLENBQUMsYUFBYSxFQUFFLENBQUM7Q0FDN0IsQ0FBQzs7O0FDOURGLGdGQUFnRjtBQUNoRixRQUFRO0FBQ1IsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDO0FBQ3ZCLElBQUksV0FBVyxHQUFHLE1BQU0sQ0FBQztBQUN6QixJQUFJLFdBQVcsR0FBRyxRQUFRLENBQUM7QUFDM0IsSUFBSSxZQUFZLEdBQUcsU0FBUyxDQUFDO0FBQzdCLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQztBQUN6QixJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUM7QUFDdkIsSUFBSSxZQUFZLEdBQUcsU0FBUyxDQUFDO0FBQzdCLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQztBQUN2QixJQUFJLFdBQVcsR0FBRyxRQUFRLENBQUM7QUFDM0IsSUFBSSxXQUFXLEdBQUcsUUFBUSxDQUFDOztBQUUzQixnRkFBZ0Y7QUFDaEYsZ0JBQWdCO0FBQ2hCLElBQUksTUFBTSxHQUFHO0VBQ1gsVUFBVSxFQUFFLElBQUk7RUFDaEIsVUFBVSxFQUFFLElBQUk7RUFDaEIsV0FBVyxFQUFFLElBQUk7RUFDakIsVUFBVSxFQUFFLElBQUk7RUFDaEIsWUFBWSxFQUFFLElBQUk7RUFDbEIsV0FBVyxFQUFFLElBQUk7Q0FDbEIsQ0FBQztBQUNGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDOztBQUV4QixnRkFBZ0Y7QUFDaEYsaUJBQWlCO0FBQ2pCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsU0FBUyxJQUFJLEVBQUUsTUFBTSxFQUFFO0VBQ25DLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDdEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3QixDQUFDLENBQUM7O0FBRUYsTUFBTSxDQUFDLGVBQWUsR0FBRyxTQUFTLElBQUksRUFBRTtFQUN0QyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7RUFDdEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO0FBQ3RDLENBQUMsQ0FBQzs7QUFFRixNQUFNLENBQUMsVUFBVSxHQUFHLFNBQVMsSUFBSSxFQUFFO0FBQ25DLEVBQUUsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7RUFFekIsSUFBSSxNQUFNLEtBQUssVUFBVSxFQUFFO0lBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDO0lBQ3pCLElBQUksQ0FBQyxVQUFVLEdBQUcscUJBQXFCLENBQUM7SUFDeEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUN4QixNQUFNO0lBQ0wsSUFBSSxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUM7SUFDMUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxxQkFBcUIsQ0FBQztJQUN4QyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ3pCO0FBQ0gsQ0FBQyxDQUFDOztBQUVGLE1BQU0sQ0FBQyxXQUFXLEdBQUcsU0FBUyxJQUFJLEVBQUU7QUFDcEMsRUFBRSxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDOztFQUVqQyxPQUFPLFVBQVU7RUFDakIsS0FBSyxXQUFXO0lBQ2QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdCLE1BQU07RUFDUixLQUFLLFlBQVk7SUFDZixJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUIsTUFBTTtFQUNSLEtBQUssVUFBVTtJQUNiLE1BQU07RUFDUjtJQUNFLFVBQVUsR0FBRyxTQUFTLENBQUM7QUFDM0IsR0FBRzs7RUFFRCxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztBQUMvQixDQUFDLENBQUM7O0FBRUYsTUFBTSxDQUFDLGlCQUFpQixHQUFHLFNBQVMsSUFBSSxFQUFFO0VBQ3hDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7RUFDekIsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtJQUNuQixJQUFJLENBQUMsVUFBVSxHQUFHLFdBQVcsQ0FBQztHQUMvQixNQUFNO0lBQ0wsSUFBSSxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUM7R0FDL0I7QUFDSCxDQUFDLENBQUM7O0FBRUYsTUFBTSxDQUFDLGtCQUFrQixHQUFHLFNBQVMsSUFBSSxFQUFFO0FBQzNDLEVBQUUsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQzs7RUFFM0IsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFO0lBQ1osR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRTtNQUNwQixJQUFJLENBQUMsV0FBVyxHQUFHLFlBQVksQ0FBQztLQUNqQyxNQUFNO01BQ0wsSUFBSSxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUM7S0FDOUI7R0FDRjtBQUNILENBQUMsQ0FBQzs7QUFFRixNQUFNLENBQUMsWUFBWSxHQUFHLFNBQVMsSUFBSSxFQUFFOztBQUVyQyxDQUFDLENBQUM7O0FBRUYsZ0ZBQWdGO0FBQ2hGLGdCQUFnQjtBQUNoQixNQUFNLENBQUMsaUJBQWlCLEdBQUcsV0FBVztFQUNwQyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7QUFDekIsQ0FBQyxDQUFDOztBQUVGLE1BQU0sQ0FBQyxhQUFhLEdBQUcsV0FBVztFQUNoQyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7QUFDekIsQ0FBQyxDQUFDOztBQUVGLE1BQU0sQ0FBQyxlQUFlLEdBQUcsV0FBVztFQUNsQyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7QUFDM0IsQ0FBQyxDQUFDOztBQUVGLE1BQU0sQ0FBQyxjQUFjLEdBQUcsV0FBVztFQUNqQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7QUFDMUIsQ0FBQyxDQUFDOztBQUVGLGdGQUFnRjtBQUNoRixzQkFBc0I7QUFDdEIsTUFBTSxDQUFDLFNBQVMsR0FBRyxXQUFXO0VBQzVCLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxVQUFVLENBQUM7QUFDcEMsQ0FBQyxDQUFDOztBQUVGLE1BQU0sQ0FBQyxVQUFVLEdBQUcsV0FBVztFQUM3QixPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssV0FBVyxDQUFDO0FBQ3JDLENBQUMsQ0FBQzs7QUFFRixNQUFNLENBQUMsWUFBWSxHQUFHLFdBQVc7RUFDL0IsT0FBTyxJQUFJLENBQUMsVUFBVSxLQUFLLFdBQVcsQ0FBQztBQUN6QyxDQUFDLENBQUM7O0FBRUYsTUFBTSxDQUFDLGFBQWEsR0FBRyxXQUFXO0VBQ2hDLE9BQU8sSUFBSSxDQUFDLFVBQVUsS0FBSyxZQUFZLENBQUM7QUFDMUMsQ0FBQyxDQUFDOztBQUVGLE1BQU0sQ0FBQyxXQUFXLEdBQUcsV0FBVztFQUM5QixPQUFPLElBQUksQ0FBQyxVQUFVLEtBQUssVUFBVSxDQUFDO0FBQ3hDLENBQUMsQ0FBQzs7QUFFRixNQUFNLENBQUMsVUFBVSxHQUFHLFdBQVc7RUFDN0IsT0FBTyxJQUFJLENBQUMsVUFBVSxLQUFLLFNBQVMsQ0FBQztBQUN2QyxDQUFDLENBQUM7O0FBRUYsTUFBTSxDQUFDLGFBQWEsR0FBRyxXQUFXO0VBQ2hDLE9BQU8sSUFBSSxDQUFDLFdBQVcsS0FBSyxZQUFZLENBQUM7QUFDM0MsQ0FBQyxDQUFDOztBQUVGLE1BQU0sQ0FBQyxVQUFVLEdBQUcsV0FBVztFQUM3QixPQUFPLElBQUksQ0FBQyxXQUFXLEtBQUssU0FBUyxDQUFDO0FBQ3hDLENBQUMsQ0FBQzs7QUFFRixNQUFNLENBQUMsWUFBWSxHQUFHLFdBQVc7RUFDL0IsT0FBTyxJQUFJLENBQUMsVUFBVSxLQUFLLFdBQVcsQ0FBQztBQUN6QyxDQUFDLENBQUM7O0FBRUYsTUFBTSxDQUFDLFlBQVksR0FBRyxXQUFXO0VBQy9CLE9BQU8sSUFBSSxDQUFDLFVBQVUsS0FBSyxXQUFXLENBQUM7Q0FDeEMsQ0FBQzs7O0FDekpGLE9BQU87QUFDUCxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0IsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUUzQixPQUFPO0FBQ1AsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUMvQixJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO0FBQzdCLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDM0IsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztBQUM3QixJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ3pCLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDM0IsSUFBSSxjQUFjLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQztBQUMzQyxJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO0FBQ25DLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7O0FBRS9CLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQzs7QUFFaEIsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQUM7RUFDVixNQUFNLEVBQUUsTUFBTTtFQUNkLFVBQVUsRUFBRSxVQUFVO0VBQ3RCLFlBQVksRUFBRSxRQUFRO0VBQ3RCLFdBQVcsRUFBRSxPQUFPO0VBQ3BCLE9BQU8sRUFBRSxPQUFPO0VBQ2hCLE1BQU0sRUFBRSxNQUFNO0FBQ2hCLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQzs7QUFFWCxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUN6QyxNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDO0VBQ1YsS0FBSyxFQUFFLEtBQUs7RUFDWixPQUFPLEVBQUUsT0FBTztFQUNoQixNQUFNLEVBQUUsTUFBTTtFQUNkLE1BQU0sRUFBRSxNQUFNO0FBQ2hCLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQzs7QUFFWCxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUMzQyxNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN6QixPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQzs7QUFFekIsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ2hDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVuQixTQUFTO0FBQ1QsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDeEQsS0FBSyxDQUFDLE1BQU07RUFDVixLQUFLLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUM7RUFDakMsUUFBUSxDQUFDLGNBQWMsQ0FBQyx5QkFBeUIsQ0FBQztDQUNuRCxDQUFDOzs7QUNqREYsT0FBTztBQUNQLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFaEMsU0FBUyxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ3BCLEVBQUUsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQzs7RUFFdkIsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFO0lBQ1YsS0FBSyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDckM7QUFDSCxFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDOztFQUVuQixPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7O0FBRUQsU0FBUyxRQUFRLEdBQUc7RUFDbEIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3BCLENBQUM7O0FBRUQsY0FBYztBQUNkLElBQUksS0FBSyxHQUFHOztBQUVaLEVBQUUsS0FBSyxFQUFFLElBQUk7QUFDYjs7RUFFRSxJQUFJLEVBQUUsSUFBSTtFQUNWLFFBQVEsRUFBRSxRQUFRO0NBQ25CLENBQUM7QUFDRixNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQzs7O0FDM0J2QixnQkFBZ0I7QUFDaEIsSUFBSSxNQUFNLEdBQUc7RUFDWCxVQUFVLEVBQUUsSUFBSTtFQUNoQixZQUFZLEVBQUUsSUFBSTtFQUNsQixXQUFXLEVBQUUsSUFBSTtFQUNqQixXQUFXLEVBQUUsSUFBSTtDQUNsQixDQUFDO0FBQ0YsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7O0FBRXhCLGlCQUFpQjtBQUNqQixNQUFNLENBQUMsSUFBSSxHQUFHLFNBQVMsSUFBSSxFQUFFLE1BQU0sRUFBRTs7RUFFbkMsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztFQUMzQixJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0VBQzlDLElBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7RUFDbEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUNsRCxFQUFFLElBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDbEQ7O0VBRUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDNUIsSUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFLEVBQUU7SUFDeEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDNUI7RUFDRCxJQUFJLE1BQU0sQ0FBQyxhQUFhLEVBQUUsRUFBRTtJQUMxQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUM5QjtFQUNELElBQUksTUFBTSxDQUFDLFlBQVksRUFBRSxFQUFFO0lBQ3pCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzdCO0NBQ0YsQ0FBQzs7OztBQzdCRixPQUFPO0FBQ1AsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3ZDLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFaEMsRUFBRTtBQUNGLFNBQVMsSUFBSSxDQUFDLElBQUksRUFBRTtFQUNsQixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0VBQ3pCLElBQUksTUFBTSxDQUFDO0FBQ2IsRUFBRSxJQUFJLE1BQU0sQ0FBQzs7RUFFWCxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUU7QUFDZixJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7O01BRWxCLE1BQU0sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztNQUM3QyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2hDLEtBQUssTUFBTTs7TUFFTCxNQUFNLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7TUFDN0MsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztLQUMzQjtHQUNGLE1BQU07SUFDTCxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzFCLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7R0FDM0I7RUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUN2QixFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOztFQUVyQixPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7O0FBRUQsZUFBZTtBQUNmLElBQUksS0FBSyxHQUFHOztFQUVWLE1BQU0sRUFBRSxJQUFJO0FBQ2QsRUFBRSxNQUFNLEVBQUUsSUFBSTtBQUNkOztFQUVFLElBQUksRUFBRSxJQUFJO0NBQ1gsQ0FBQztBQUNGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDOztBQUV2QixVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUV4QixnQkFBZ0I7QUFDaEIsS0FBSyxDQUFDLFNBQVMsR0FBRyxXQUFXO0VBQzNCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUNyQixDQUFDLENBQUM7O0FBRUYsS0FBSyxDQUFDLFNBQVMsR0FBRyxXQUFXO0VBQzNCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUNyQixDQUFDLENBQUM7O0FBRUYsZ0JBQWdCO0FBQ2hCLEtBQUssQ0FBQyxTQUFTLEdBQUcsU0FBUyxNQUFNLEVBQUU7RUFDakMsTUFBTSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDdEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7RUFDckIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN6QixDQUFDLENBQUM7O0FBRUYsS0FBSyxDQUFDLFNBQVMsR0FBRyxTQUFTLE1BQU0sRUFBRTtFQUNqQyxNQUFNLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUN0QyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztFQUNyQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3pCLENBQUMsQ0FBQzs7QUFFRixtQkFBbUI7QUFDbkIsS0FBSyxDQUFDLFlBQVksR0FBRyxXQUFXO0VBQzlCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztFQUM5QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztFQUNyQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3pCLENBQUMsQ0FBQzs7QUFFRixLQUFLLENBQUMsWUFBWSxHQUFHLFdBQVc7RUFDOUIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0VBQzlCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0VBQ3JCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDekIsQ0FBQyxDQUFDOztBQUVGLHNCQUFzQjtBQUN0QixLQUFLLENBQUMsZ0JBQWdCLEdBQUcsV0FBVztFQUNsQyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO0FBQzlCLENBQUMsQ0FBQzs7QUFFRixLQUFLLENBQUMsZ0JBQWdCLEdBQUcsV0FBVztFQUNsQyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO0NBQzdCLENBQUM7Ozs7O0FDckZGLE9BQU87QUFDUCxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRWhDLFNBQVMsSUFBSSxDQUFDLElBQUksRUFBRTtFQUNsQixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQzdCLEVBQUUsSUFBSSxNQUFNLENBQUM7O0VBRVgsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRTtJQUNwQixNQUFNLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztHQUMxQixNQUFNO0lBQ0wsTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7R0FDdkI7RUFDRCxNQUFNLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUN0QyxNQUFNLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztBQUMzQixFQUFFLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDOztFQUV0QixPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7O0FBRUQsZ0JBQWdCO0FBQ2hCLElBQUksS0FBSyxHQUFHOztBQUVaLEVBQUUsT0FBTyxFQUFFLElBQUk7QUFDZjs7RUFFRSxJQUFJLEVBQUUsSUFBSTtDQUNYLENBQUM7QUFDRixNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQzs7QUFFdkIsS0FBSyxDQUFDLFVBQVUsR0FBRyxXQUFXO0VBQzVCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztDQUNyQixDQUFDOzs7O0FDL0JGLE9BQU87QUFDUCxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDaEMsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3ZDLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFckIsU0FBUyxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ3BCLEVBQUUsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7RUFFekIsSUFBSSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtJQUNsQyxNQUFNLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUN2QyxNQUFNO0lBQ0wsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUMxQixNQUFNLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztHQUN0QjtBQUNILEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7O0VBRXJCLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQzs7QUFFRCxlQUFlO0FBQ2YsSUFBSSxLQUFLLEdBQUc7O0FBRVosRUFBRSxNQUFNLEVBQUUsSUFBSTtBQUNkOztFQUVFLElBQUksRUFBRSxJQUFJO0NBQ1gsQ0FBQztBQUNGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDOztBQUV2QixnQkFBZ0I7QUFDaEIsS0FBSyxDQUFDLFNBQVMsR0FBRyxXQUFXO0VBQzNCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUNyQixDQUFDLENBQUM7O0FBRUYsbUJBQW1CO0FBQ25CLEtBQUssQ0FBQyxVQUFVLEdBQUcsU0FBUyxJQUFJLEVBQUU7RUFDaEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0VBQzNCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDekIsQ0FBQyxDQUFDOztBQUVGLEtBQUssQ0FBQyxhQUFhLEdBQUcsV0FBVztFQUMvQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRywyQkFBMkIsQ0FBQztFQUNsRCxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3pCLENBQUMsQ0FBQzs7QUFFRixLQUFLLENBQUMsY0FBYyxHQUFHLFNBQVMsTUFBTSxFQUFFO0VBQ3RDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQztFQUNqQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3pCLENBQUMsQ0FBQzs7QUFFRixVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDOzs7OztBQ2xEeEIsU0FBUyxTQUFTLEdBQUc7RUFDbkIsT0FBTztJQUNMLEVBQUUsRUFBRSxJQUFJO0lBQ1IsUUFBUSxFQUFFLGNBQWM7SUFDeEIsT0FBTyxFQUFFLDJCQUEyQjtJQUNwQyxPQUFPLEVBQUUsSUFBSTtJQUNiLE9BQU8sRUFBRSxJQUFJO0lBQ2IsT0FBTyxFQUFFLElBQUk7SUFDYixNQUFNLEVBQUUsSUFBSTtJQUNaLFdBQVcsRUFBRSxJQUFJO0lBQ2pCLFNBQVMsRUFBRSxJQUFJO0lBQ2YsU0FBUyxFQUFFLElBQUk7SUFDZixTQUFTLEVBQUUsSUFBSTtBQUNuQixJQUFJLEdBQUcsRUFBRSxJQUFJOztJQUVULFFBQVEsRUFBRSxLQUFLO0lBQ2YsU0FBUyxFQUFFLElBQUk7R0FDaEIsQ0FBQztDQUNIO0FBQ0QsT0FBTyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7O0FBRTlCLFNBQVMsZUFBZSxDQUFDLE1BQU0sRUFBRTtFQUMvQixJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxTQUFTLElBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0VBQzFFLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7RUFDdEUsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsSUFBSSxNQUFNLENBQUMsVUFBVSxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztFQUM5RSxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxJQUFJLE1BQU0sQ0FBQyxVQUFVLElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0VBQzlFLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLElBQUksTUFBTSxDQUFDLFVBQVUsSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDaEYsRUFBRSxJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsV0FBVyxJQUFJLE1BQU0sQ0FBQyxZQUFZLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDOztFQUV0RixPQUFPO0lBQ0wsRUFBRSxFQUFFLE1BQU0sQ0FBQyxFQUFFO0lBQ2IsUUFBUSxFQUFFLFFBQVE7SUFDbEIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPO0lBQ3ZCLFFBQVEsRUFBRSxJQUFJO0lBQ2QsU0FBUyxFQUFFLEtBQUs7SUFDaEIsT0FBTyxFQUFFLE9BQU87SUFDaEIsU0FBUyxFQUFFLFNBQVM7SUFDcEIsU0FBUyxFQUFFLFNBQVM7SUFDcEIsU0FBUyxFQUFFLFNBQVM7SUFDcEIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPO0lBQ3ZCLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTztJQUN2QixNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU07SUFDckIsV0FBVyxFQUFFLFdBQVc7SUFDeEIsR0FBRyxFQUFFLE1BQU0sQ0FBQyxHQUFHO0dBQ2hCLENBQUM7Q0FDSDtBQUNELE9BQU8sQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDOzs7O0FDOUMxQyxPQUFPO0FBQ1AsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUUvQixTQUFTLGNBQWMsR0FBRzs7RUFFeEIsSUFBSSxjQUFjLEdBQUcsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDckQsRUFBRSxJQUFJLGNBQWMsR0FBRyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQzs7RUFFbkQsY0FBYyxDQUFDLFVBQVUsQ0FBQztJQUN4QixRQUFRLEVBQUUsSUFBSTtHQUNmLENBQUMsQ0FBQztFQUNILGNBQWMsQ0FBQyxVQUFVLENBQUM7SUFDeEIsUUFBUSxFQUFFLElBQUk7R0FDZixDQUFDLENBQUM7Q0FDSjtBQUNELE9BQU8sQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDOztBQUV4QyxTQUFTLGlCQUFpQixHQUFHO0VBQzNCLElBQUksYUFBYSxHQUFHLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0VBQ2pELGFBQWEsQ0FBQyxRQUFRLENBQUM7SUFDckIsV0FBVyxFQUFFLElBQUk7SUFDakIsTUFBTSxFQUFFLFVBQVU7SUFDbEIsTUFBTSxFQUFFLEdBQUc7R0FDWixDQUFDLENBQUM7Q0FDSjtBQUNELE9BQU8sQ0FBQyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQzs7Ozs7QUN6QjlDLE9BQU87QUFDUCxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTdCLG1CQUFtQjtBQUNuQixJQUFJLE1BQU0sQ0FBQztBQUNYLElBQUksTUFBTSxDQUFDO0FBQ1gsSUFBSSxVQUFVLENBQUM7O0FBRWYsYUFBYTtBQUNiLElBQUksK0JBQStCLHlCQUFBO0VBQ2pDLGVBQWUsRUFBRSxXQUFXO0lBQzFCLE9BQU87TUFDTCxLQUFLLEVBQUUsVUFBVSxDQUFDLFFBQVEsRUFBRTtLQUM3QixDQUFDO0FBQ04sR0FBRzs7RUFFRCxNQUFNLEVBQUUsV0FBVztJQUNqQjtNQUNFLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsa0JBQW1CLENBQUEsRUFBQTtRQUNoQyxvQkFBQSxPQUFNLEVBQUEsQ0FBQSxDQUFDLElBQUEsRUFBSSxDQUFDLFNBQUEsRUFBUyxDQUFDLElBQUEsRUFBSSxDQUFDLFFBQUEsRUFBUSxDQUFDLEtBQUEsRUFBSyxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUcsQ0FBRSxDQUFBLEVBQUE7UUFDakUsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxjQUFlLENBQUEsRUFBQTtBQUFBLFVBQUEsT0FBQTtBQUFBLFFBRXhCLENBQUEsRUFBQTtRQUNOLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsYUFBYyxDQUFBLEVBQUE7QUFBQSxVQUFBLDBEQUFBO0FBQUEsUUFFdkIsQ0FBQSxFQUFBO1FBQ04sb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxhQUFjLENBQUEsRUFBQTtVQUMzQixvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGFBQWMsQ0FBQSxFQUFBO1lBQzNCLG9CQUFBLElBQUcsRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsY0FBZSxDQUFBLEVBQUE7Y0FDM0Isb0JBQUEsSUFBRyxFQUFBLElBQUMsRUFBQTtnQkFDRixvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLDRCQUE2QixDQUFBLEVBQUE7a0JBQzFDLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsNEJBQUEsRUFBNEIsQ0FBQyxHQUFBLEVBQUcsQ0FBQyxFQUFBLEVBQUUsQ0FBQyxHQUFBLEVBQUcsQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFRLENBQUUsQ0FBQTtnQkFDL0UsQ0FBQSxFQUFBO2dCQUNOLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsMEJBQTJCLENBQUEsRUFBQTtrQkFDeEMsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQywwQkFBMkIsQ0FBQSxFQUFBO29CQUN2QyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFTO2tCQUN2QixDQUFBO2dCQUNGLENBQUE7Y0FDSCxDQUFBO1lBQ0YsQ0FBQTtVQUNELENBQUE7UUFDRixDQUFBO01BQ0YsQ0FBQTtNQUNOO0dBQ0g7QUFDSCxDQUFDLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsR0FBRyxFQUFFOztFQUU3QixNQUFNLEdBQUcsR0FBRyxDQUFDO0VBQ2IsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDekIsRUFBRSxVQUFVLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7O0VBRXRDLE9BQU8sU0FBUyxDQUFDO0NBQ2xCLENBQUM7OztBQ3RERixPQUFPO0FBQ1AsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU3QixtQkFBbUI7QUFDbkIsSUFBSSxNQUFNLENBQUM7QUFDWCxJQUFJLE1BQU0sQ0FBQztBQUNYLElBQUksV0FBVyxDQUFDO0FBQ2hCLElBQUksYUFBYSxDQUFDOztBQUVsQixhQUFhO0FBQ2IsSUFBSSw4QkFBOEIsd0JBQUE7RUFDaEMsZUFBZSxFQUFFLFdBQVc7SUFDMUIsT0FBTztNQUNMLFNBQVMsRUFBRSxXQUFXLENBQUMsU0FBUyxFQUFFLENBQUMsT0FBTztLQUMzQyxDQUFDO0FBQ04sR0FBRzs7RUFFRCxpQkFBaUIsRUFBRSxXQUFXO0lBQzVCLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNwRCxHQUFHOztFQUVELG9CQUFvQixFQUFFLFdBQVc7SUFDL0IsV0FBVyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3RELEdBQUc7O0VBRUQsY0FBYyxFQUFFLFdBQVc7SUFDekIsSUFBSSxDQUFDLFFBQVEsQ0FBQztNQUNaLFNBQVMsRUFBRSxXQUFXLENBQUMsU0FBUyxFQUFFLENBQUMsT0FBTztLQUMzQyxDQUFDLENBQUM7QUFDUCxHQUFHOztFQUVELGlCQUFpQixFQUFFLFNBQVMsQ0FBQyxFQUFFO0lBQzdCLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUNuQixhQUFhLENBQUMsYUFBYSxFQUFFLENBQUM7QUFDbEMsR0FBRzs7RUFFRCxpQkFBaUIsRUFBRSxTQUFTLENBQUMsRUFBRTtJQUM3QixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDbkIsYUFBYSxDQUFDLGFBQWEsRUFBRSxDQUFDO0FBQ2xDLEdBQUc7O0VBRUQsTUFBTSxFQUFFLFdBQVc7SUFDakI7TUFDRSxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGtCQUFtQixDQUFBLEVBQUE7UUFDaEMsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxXQUFZLENBQUEsRUFBQTtVQUN6QixvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLDhCQUFBLEVBQThCLENBQUMsR0FBQSxFQUFHLENBQUMsRUFBQSxFQUFFLENBQUMsR0FBQSxFQUFHLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFVLENBQUUsQ0FBQSxFQUFBO1VBQ2pGLG9CQUFBLE9BQU0sRUFBQSxDQUFBLENBQUMsR0FBQSxFQUFHLENBQUMsY0FBQSxFQUFjLENBQUMsSUFBQSxFQUFJLENBQUMsU0FBQSxFQUFTO2lCQUNqQyxJQUFBLEVBQUksQ0FBQyxNQUFBLEVBQU0sQ0FBQyxNQUFBLEVBQU0sQ0FBQyxTQUFBLEVBQVMsQ0FBQyxTQUFBLEVBQVMsQ0FBQyx5QkFBeUIsQ0FBRSxDQUFBO1FBQ3JFLENBQUEsRUFBQTtRQUNOLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsZUFBZ0IsQ0FBQSxFQUFBO1VBQzdCLG9CQUFBLFFBQU8sRUFBQSxDQUFBLENBQUMsT0FBQSxFQUFPLENBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFDO2tCQUNoQyxTQUFBLEVBQVMsQ0FBQyxpQkFBa0IsQ0FBQSxFQUFBLFFBQWUsQ0FBQSxFQUFBO1VBQ25ELG9CQUFBLFFBQU8sRUFBQSxDQUFBLENBQUMsT0FBQSxFQUFPLENBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFDLENBQUMsU0FBQSxFQUFTLENBQUMsZ0JBQWlCLENBQUEsRUFBQSxRQUFlLENBQUE7UUFDL0UsQ0FBQTtNQUNGLENBQUE7TUFDTjtHQUNIO0FBQ0gsQ0FBQyxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLEdBQUcsRUFBRTs7RUFFN0IsTUFBTSxHQUFHLEdBQUcsQ0FBQztFQUNiLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0VBQ3ZCLFdBQVcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztBQUMxQyxFQUFFLGFBQWEsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQzs7RUFFN0MsT0FBTyxRQUFRLENBQUM7Q0FDakIsQ0FBQzs7O0FDbkVGLE9BQU87QUFDUCxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0IsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVyQixtQkFBbUI7QUFDbkIsSUFBSSxNQUFNLENBQUM7QUFDWCxJQUFJLE1BQU0sQ0FBQztBQUNYLElBQUksTUFBTSxDQUFDO0FBQ1gsSUFBSSxJQUFJLENBQUM7QUFDVCxJQUFJLFdBQVcsQ0FBQzs7QUFFaEIsYUFBYTtBQUNiLElBQUksOEJBQThCLHdCQUFBO0VBQ2hDLGVBQWUsRUFBRSxXQUFXO0lBQzFCLE9BQU87TUFDTCxNQUFNLEVBQUUsV0FBVyxDQUFDLFNBQVMsRUFBRTtLQUNoQyxDQUFDO0FBQ04sR0FBRzs7RUFFRCxpQkFBaUIsRUFBRSxXQUFXO0lBQzVCLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUMvQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDdEIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7QUFDN0IsR0FBRzs7RUFFRCxvQkFBb0IsRUFBRSxXQUFXO0lBQy9CLFdBQVcsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNyRCxHQUFHOztFQUVELGtCQUFrQixFQUFFLFNBQVMsQ0FBQyxFQUFFO0lBQzlCLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDaEUsV0FBVyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN2QyxHQUFHOztFQUVELGFBQWEsRUFBRSxXQUFXO0lBQ3hCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNyRCxHQUFHOztFQUVELGNBQWMsRUFBRSxXQUFXO0lBQ3pCLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztNQUMzRDtRQUNFLG9CQUFBLFFBQU8sRUFBQSxDQUFBLENBQUMsR0FBQSxFQUFHLENBQUUsQ0FBQyxFQUFDLENBQUMsS0FBQSxFQUFLLENBQUUsQ0FBRyxDQUFBLEVBQUMsQ0FBVyxDQUFBO1FBQ3RDO0FBQ1IsS0FBSyxDQUFDLENBQUM7O0lBRUg7TUFDRSxvQkFBQSxRQUFPLEVBQUEsQ0FBQSxDQUFDLElBQUEsRUFBSSxDQUFDLFFBQUEsRUFBUSxDQUFDLFNBQUEsRUFBUyxDQUFDLGNBQUEsRUFBYztjQUN0QyxZQUFBLEVBQVksQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUM7Y0FDNUMsR0FBQSxFQUFHLENBQUMsVUFBQSxFQUFVLENBQUMsUUFBQSxFQUFRLENBQUUsSUFBSSxDQUFDLGtCQUFvQixDQUFBLEVBQUE7UUFDdkQsUUFBUztNQUNILENBQUE7TUFDVDtBQUNOLEdBQUc7O0VBRUQsYUFBYSxFQUFFLFdBQVc7SUFDeEIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLEVBQUUsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO01BQ3pEO1FBQ0Usb0JBQUEsUUFBTyxFQUFBLENBQUEsQ0FBQyxHQUFBLEVBQUcsQ0FBRSxDQUFDLEVBQUMsQ0FBQyxLQUFBLEVBQUssQ0FBRSxDQUFHLENBQUEsRUFBQyxDQUFXLENBQUE7UUFDdEM7QUFDUixLQUFLLENBQUMsQ0FBQzs7SUFFSDtNQUNFLG9CQUFBLFFBQU8sRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsY0FBQSxFQUFjO2NBQ3hCLFlBQUEsRUFBWSxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBQztjQUN2QyxJQUFBLEVBQUksQ0FBQyxRQUFTLENBQUEsRUFBQTtRQUNuQixPQUFRO01BQ0YsQ0FBQTtNQUNUO0FBQ04sR0FBRzs7RUFFRCxNQUFNLEVBQUUsV0FBVztJQUNqQixJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDN0MsSUFBSSxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7O0lBRXZDO01BQ0Usb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxrQkFBbUIsQ0FBQSxFQUFBO1FBQ2hDLG9CQUFBLE9BQU0sRUFBQSxDQUFBLENBQUMsSUFBQSxFQUFJLENBQUMsVUFBQSxFQUFVLENBQUMsSUFBQSxFQUFJLENBQUMsUUFBQSxFQUFRLENBQUMsS0FBQSxFQUFLLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRyxDQUFBLENBQUcsQ0FBQSxFQUFBO1FBQ3BFLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsbUJBQW9CLENBQUEsRUFBQTtVQUNqQyxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGdCQUFpQixDQUFBLEVBQUE7QUFBQSxZQUFBLE9BQUE7QUFBQSxBQUUxQyxVQUFnQixDQUFBLEVBQUE7O1VBRU4sb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxjQUFlLENBQUEsRUFBQTtZQUM1QixvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGtCQUFtQixDQUFBLEVBQUE7Y0FDaEMsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxtQkFBb0IsQ0FBQSxFQUFBO0FBQUEsZ0JBQUEsS0FBQTtBQUFBLGNBRTdCLENBQUEsRUFBQTtjQUNOLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsb0JBQXFCLENBQUEsRUFBQTtnQkFDbEMsb0JBQUEsT0FBTSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxjQUFBLEVBQWMsQ0FBQyxJQUFBLEVBQUksQ0FBQyxNQUFBLEVBQU0sQ0FBQyxJQUFBLEVBQUksQ0FBQyxNQUFBLEVBQU0sQ0FBQyxZQUFBLEVBQVksQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFTLENBQUEsQ0FBRyxDQUFBO2NBQ2hHLENBQUE7QUFDcEIsWUFBa0IsQ0FBQSxFQUFBOztZQUVOLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsa0JBQW1CLENBQUEsRUFBQTtjQUNoQyxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLG1CQUFvQixDQUFBLEVBQUE7QUFBQSxnQkFBQSxXQUFBO0FBQUEsY0FFN0IsQ0FBQSxFQUFBO2NBQ04sb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxvQkFBcUIsQ0FBQSxFQUFBO2dCQUNsQyxvQkFBQSxPQUFNLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGlDQUFBLEVBQWlDO3VCQUMzQyxZQUFBLEVBQVksQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUM7dUJBQzFDLElBQUEsRUFBSSxDQUFDLFdBQUEsRUFBVyxDQUFDLElBQUEsRUFBSSxDQUFDLE1BQU0sQ0FBRSxDQUFBO2NBQ2pDLENBQUE7QUFDcEIsWUFBa0IsQ0FBQSxFQUFBOztZQUVOLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsa0JBQW1CLENBQUEsRUFBQTtjQUNoQyxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLG1CQUFvQixDQUFBLEVBQUE7QUFBQSxnQkFBQSxZQUFBO0FBQUEsY0FFN0IsQ0FBQSxFQUFBO2NBQ04sb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxvQkFBcUIsQ0FBQSxFQUFBO2dCQUNqQyxZQUFhO2NBQ1YsQ0FBQTtBQUNwQixZQUFrQixDQUFBLEVBQUE7O1lBRU4sb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsS0FBSyxNQUFNLEdBQUcsRUFBRSxHQUFHLFNBQVMsSUFBSSxrQkFBb0IsQ0FBQSxFQUFBO2NBQ2hHLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsbUJBQW9CLENBQUEsRUFBQTtBQUFBLGdCQUFBLFVBQUE7QUFBQSxjQUU3QixDQUFBLEVBQUE7Y0FDTixvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLG9CQUFxQixDQUFBLEVBQUE7Z0JBQ2xDLG9CQUFBLE9BQU0sRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsaUNBQUEsRUFBaUM7dUJBQzNDLFlBQUEsRUFBWSxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBQzt1QkFDMUMsSUFBQSxFQUFJLENBQUMsV0FBQSxFQUFXLENBQUMsSUFBQSxFQUFJLENBQUMsTUFBTSxDQUFBLENBQUcsQ0FBQTtjQUNsQyxDQUFBO0FBQ3BCLFlBQWtCLENBQUEsRUFBQTs7WUFFTixvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGtCQUFtQixDQUFBLEVBQUE7Y0FDaEMsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxtQkFBb0IsQ0FBQSxFQUFBO0FBQUEsZ0JBQUEsV0FBQTtBQUFBLGNBRTdCLENBQUEsRUFBQTtjQUNOLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsb0JBQXFCLENBQUEsRUFBQTtnQkFDakMsV0FBWTtjQUNULENBQUE7QUFDcEIsWUFBa0IsQ0FBQSxFQUFBOztZQUVOLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsa0JBQW1CLENBQUEsRUFBQTtjQUNoQyxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLG1CQUFvQixDQUFBLEVBQUE7QUFBQSxnQkFBQSxZQUFBO0FBQUEsY0FFN0IsQ0FBQSxFQUFBO2NBQ04sb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxvQkFBcUIsQ0FBQSxFQUFBO2dCQUNsQyxvQkFBQSxPQUFNLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGNBQUEsRUFBYyxDQUFDLElBQUEsRUFBSSxDQUFDLE9BQUEsRUFBTyxDQUFDLElBQUEsRUFBSSxDQUFDLE1BQUEsRUFBTSxDQUFDLFlBQUEsRUFBWSxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQVEsQ0FBRSxDQUFBO2NBQy9GLENBQUE7QUFDcEIsWUFBa0IsQ0FBQSxFQUFBOztZQUVOLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsa0JBQW1CLENBQUEsRUFBQTtjQUNoQyxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLG1CQUFvQixDQUFBLEVBQUE7QUFBQSxnQkFBQSxTQUFBO0FBQUEsY0FFN0IsQ0FBQSxFQUFBO2NBQ04sb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxvQkFBcUIsQ0FBQSxFQUFBO2dCQUNsQyxvQkFBQSxVQUFTLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGNBQUEsRUFBYyxDQUFDLElBQUEsRUFBSSxDQUFDLElBQUEsRUFBSSxDQUFDLEVBQUEsRUFBRSxDQUFDLEVBQUEsRUFBRTswQkFDeEMsWUFBQSxFQUFZLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFDOzBCQUN4QyxJQUFBLEVBQUksQ0FBQyxTQUFBLEVBQVMsQ0FBQyxJQUFBLEVBQUksQ0FBQyxHQUFJLENBQVcsQ0FBQTtjQUN6QyxDQUFBO0FBQ3BCLFlBQWtCLENBQUE7O1VBRUYsQ0FBQTtBQUNoQixRQUFjLENBQUEsRUFBQTs7UUFFTixvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLG1CQUFvQixDQUFBLEVBQUE7VUFDakMsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxnQkFBaUIsQ0FBQSxFQUFBO0FBQUEsWUFBQSxTQUFBO0FBQUEsVUFFMUIsQ0FBQSxFQUFBO1VBQ04sb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxjQUFlLENBQUEsRUFBQTtZQUM1QixvQkFBQSxVQUFTLEVBQUEsQ0FBQSxDQUFDLElBQUEsRUFBSSxDQUFDLFNBQUEsRUFBUyxDQUFDLFlBQUEsRUFBWSxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBQztzQkFDdkQsU0FBQSxFQUFTLENBQUMsZ0NBQWlDLENBQVcsQ0FBQTtVQUM1RCxDQUFBO1FBQ0YsQ0FBQTtNQUNGLENBQUE7TUFDTjtHQUNIO0FBQ0gsQ0FBQyxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLEdBQUcsRUFBRTs7RUFFN0IsTUFBTSxHQUFHLEdBQUcsQ0FBQztFQUNiLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0VBQ3ZCLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0VBQ3ZCLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ3JCLEVBQUUsV0FBVyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7O0VBRWpDLE9BQU8sUUFBUSxDQUFDO0NBQ2pCLENBQUM7OztBQ2xMRixPQUFPO0FBQ1AsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU3QixtQkFBbUI7QUFDbkIsSUFBSSxNQUFNLENBQUM7QUFDWCxJQUFJLE1BQU0sQ0FBQzs7QUFFWCxZQUFZO0FBQ1osSUFBSSxVQUFVLENBQUM7QUFDZixJQUFJLFdBQVcsQ0FBQztBQUNoQixJQUFJLFNBQVMsQ0FBQzs7QUFFZCxhQUFhO0FBQ2IsSUFBSSw4QkFBOEIsd0JBQUE7RUFDaEMsZ0JBQWdCLEVBQUUsV0FBVztJQUMzQixJQUFJLE1BQU0sQ0FBQyxZQUFZLEVBQUUsRUFBRTtNQUN6QjtRQUNFLG9CQUFDLFVBQVUsRUFBQSxJQUFBLENBQUcsQ0FBQTtRQUNkO0tBQ0g7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNoQixHQUFHOztFQUVELGlCQUFpQixFQUFFLFdBQVc7SUFDNUIsSUFBSSxNQUFNLENBQUMsYUFBYSxFQUFFLEVBQUU7TUFDMUI7UUFDRSxvQkFBQyxXQUFXLEVBQUEsSUFBQSxDQUFHLENBQUE7UUFDZjtLQUNIO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDaEIsR0FBRzs7RUFFRCxlQUFlLEVBQUUsV0FBVztJQUMxQixJQUFJLE1BQU0sQ0FBQyxXQUFXLEVBQUUsRUFBRTtNQUN4QjtRQUNFLG9CQUFDLFNBQVMsRUFBQSxJQUFBLENBQUcsQ0FBQTtRQUNiO0tBQ0g7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNoQixHQUFHOztFQUVELE1BQU0sRUFBRSxXQUFXO0lBQ2pCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQ3pDLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0FBQy9DLElBQUksSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDOztJQUV2QztNQUNFLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsa0JBQW1CLENBQUEsRUFBQTtRQUMvQixVQUFVLEVBQUM7UUFDWCxXQUFXLEVBQUM7UUFDWixTQUFVO01BQ1AsQ0FBQTtNQUNOO0dBQ0g7QUFDSCxDQUFDLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsR0FBRyxFQUFFOztFQUU3QixNQUFNLEdBQUcsR0FBRyxDQUFDO0FBQ2YsRUFBRSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUN6Qjs7RUFFRSxVQUFVLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDL0MsV0FBVyxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25ELEVBQUUsU0FBUyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztFQUU3QyxPQUFPLFFBQVEsQ0FBQztDQUNqQixDQUFDOzs7QUNuRUYsT0FBTztBQUNQLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFN0IsbUJBQW1CO0FBQ25CLElBQUksTUFBTSxDQUFDO0FBQ1gsSUFBSSxNQUFNLENBQUM7QUFDWCxJQUFJLE1BQU0sQ0FBQzs7QUFFWCxZQUFZO0FBQ1osSUFBSSxRQUFRLENBQUM7QUFDYixJQUFJLFFBQVEsQ0FBQztBQUNiLElBQUksUUFBUSxDQUFDOztBQUViLGtCQUFrQjtBQUNsQixJQUFJLDhCQUE4Qix3QkFBQTtFQUNoQyxlQUFlLEVBQUUsV0FBVztJQUMxQixPQUFPLEVBQUUsQ0FBQztBQUNkLEdBQUc7O0VBRUQsVUFBVSxFQUFFLFdBQVc7SUFDckI7TUFDRSxvQkFBQyxRQUFRLEVBQUEsSUFBQSxDQUFHLENBQUE7TUFDWjtBQUNOLEdBQUc7O0VBRUQsVUFBVSxFQUFFLFdBQVc7SUFDckI7TUFDRSxvQkFBQyxRQUFRLEVBQUEsSUFBQSxDQUFHLENBQUE7TUFDWjtBQUNOLEdBQUc7O0VBRUQsVUFBVSxFQUFFLFdBQVc7SUFDckIsSUFBSSxNQUFNLENBQUMsVUFBVSxFQUFFLEVBQUU7TUFDdkIsT0FBTyxJQUFJLENBQUM7S0FDYixNQUFNO01BQ0w7UUFDRSxvQkFBQyxRQUFRLEVBQUEsSUFBQSxDQUFHLENBQUE7UUFDWjtLQUNIO0FBQ0wsR0FBRzs7RUFFRCxNQUFNLEVBQUUsV0FBVztJQUNqQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDN0IsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ2pDLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDOztJQUU3QjtNQUNFLG9CQUFBLEtBQUksRUFBQSxJQUFDLEVBQUE7UUFDSCxvQkFBQSxNQUFLLEVBQUEsQ0FBQSxDQUFDLE1BQUEsRUFBTSxDQUFFLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxFQUFDLENBQUMsTUFBQSxFQUFNLENBQUMsTUFBQSxFQUFNLENBQUMsT0FBQSxFQUFPLENBQUMscUJBQXNCLENBQUEsRUFBQTtBQUM5RixVQUFVLG9CQUFBLE9BQU0sRUFBQSxDQUFBLENBQUMsSUFBQSxFQUFJLENBQUMsWUFBQSxFQUFZLENBQUMsSUFBQSxFQUFJLENBQUMsUUFBQSxFQUFRLENBQUMsS0FBQSxFQUFLLENBQUUsTUFBTSxDQUFDLGFBQWEsRUFBRyxDQUFFLENBQUEsRUFBQTs7VUFFdkUsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxtQkFBb0IsQ0FBQSxFQUFBO1lBQ2pDLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsa0JBQW1CLENBQUEsRUFBQTtBQUFBLGNBQUEsZ0JBQUE7QUFBQSxZQUU1QixDQUFBLEVBQUE7WUFDTixvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLG9CQUFxQixDQUFBLEVBQUE7Y0FDbEMsb0JBQUEsUUFBTyxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxpQkFBa0IsQ0FBQSxFQUFBLFFBQWUsQ0FBQSxFQUFBO2NBQ25ELG9CQUFBLFFBQU8sRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsZ0JBQWlCLENBQUEsRUFBQSxRQUFlLENBQUE7WUFDOUMsQ0FBQTtBQUNsQixVQUFnQixDQUFBLEVBQUE7O1VBRU4sb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxpQkFBa0IsQ0FBQSxFQUFBO1lBQzlCLElBQUksRUFBQztZQUNMLElBQUksRUFBQztZQUNMLElBQUs7VUFDRixDQUFBO1FBQ0QsQ0FBQTtNQUNILENBQUE7TUFDTjtHQUNIO0FBQ0gsQ0FBQyxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLEdBQUcsRUFBRTs7RUFFN0IsTUFBTSxHQUFHLEdBQUcsQ0FBQztFQUNiLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ3pCLEVBQUUsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDekI7O0VBRUUsUUFBUSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQzVDLFFBQVEsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM5QyxFQUFFLFFBQVEsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7RUFFNUMsT0FBTyxRQUFRLENBQUM7Q0FDakIsQ0FBQzs7O0FDcEZGLE9BQU87QUFDUCxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTdCLG1CQUFtQjtBQUNuQixJQUFJLE1BQU0sQ0FBQztBQUNYLElBQUksTUFBTSxDQUFDO0FBQ1gsSUFBSSxXQUFXLENBQUM7QUFDaEIsSUFBSSxZQUFZLENBQUM7O0FBRWpCLGFBQWE7QUFDYixJQUFJLGdDQUFnQywwQkFBQTtFQUNsQyxlQUFlLEVBQUUsV0FBVztJQUMxQixPQUFPO01BQ0wsTUFBTSxFQUFFLFdBQVcsQ0FBQyxTQUFTLEVBQUU7TUFDL0IsTUFBTSxFQUFFLFdBQVcsQ0FBQyxTQUFTLEVBQUU7S0FDaEMsQ0FBQztBQUNOLEdBQUc7O0VBRUQsaUJBQWlCLEVBQUUsV0FBVztJQUM1QixXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDbkQsR0FBRzs7RUFFRCxvQkFBb0IsRUFBRSxXQUFXO0lBQy9CLFdBQVcsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNyRCxHQUFHOztFQUVELGFBQWEsRUFBRSxXQUFXO0lBQ3hCLElBQUksTUFBTSxHQUFHO01BQ1gsTUFBTSxFQUFFLFdBQVcsQ0FBQyxTQUFTLEVBQUU7TUFDL0IsTUFBTSxFQUFFLFdBQVcsQ0FBQyxTQUFTLEVBQUU7S0FDaEMsQ0FBQztJQUNGLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDMUIsR0FBRzs7RUFFRCxrQkFBa0IsRUFBRSxTQUFTLENBQUMsRUFBRTtJQUM5QixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDbkIsWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ2hDLEdBQUc7O0VBRUQsa0JBQWtCLEVBQUUsU0FBUyxDQUFDLEVBQUU7SUFDOUIsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ25CLFlBQVksQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUNoQyxHQUFHOztFQUVELGtCQUFrQixFQUFFLFNBQVMsQ0FBQyxFQUFFO0lBQzlCLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUNuQixZQUFZLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDaEMsR0FBRzs7RUFFRCxrQkFBa0IsRUFBRSxTQUFTLENBQUMsRUFBRTtJQUM5QixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDbkIsWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ2hDLEdBQUc7O0VBRUQsTUFBTSxFQUFFLFdBQVc7SUFDakI7TUFDRSxvQkFBQSxLQUFJLEVBQUEsSUFBQyxFQUFBO1FBQ0gsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxjQUFlLENBQUEsRUFBQTtBQUFBLFVBQUEsU0FBQTtBQUFBLFFBRXhCLENBQUEsRUFBQTtRQUNOLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsYUFBYyxDQUFBLEVBQUE7QUFBQSxVQUFBLDZGQUFBO0FBQUEsUUFFdkIsQ0FBQSxFQUFBO1FBQ04sb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxhQUFjLENBQUEsRUFBQTtVQUMzQixvQkFBQSxJQUFHLEVBQUEsSUFBQyxFQUFBO1lBQ0Ysb0JBQUEsSUFBRyxFQUFBLElBQUMsRUFBQTtjQUNGLG9CQUFBLE9BQU0sRUFBQSxDQUFBLENBQUMsSUFBQSxFQUFJLENBQUMsVUFBQSxFQUFVLENBQUMsSUFBQSxFQUFJLENBQUMsUUFBQSxFQUFRLENBQUMsS0FBQSxFQUFLLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRyxDQUFFLENBQUEsRUFBQTtjQUNuRSxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLDJCQUE0QixDQUFBLEVBQUE7Z0JBQ3pDLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsNEJBQUEsRUFBNEIsQ0FBQyxHQUFBLEVBQUcsQ0FBQyxFQUFBLEVBQUUsQ0FBQyxHQUFBLEVBQUcsQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFRLENBQUUsQ0FBQTtjQUNoRixDQUFBLEVBQUE7Y0FDTixvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLHlCQUEwQixDQUFBLEVBQUE7Z0JBQ3ZDLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMseUJBQTBCLENBQUEsRUFBQTtrQkFDdkMsb0JBQUEsTUFBSyxFQUFBLElBQUMsRUFBQSxVQUFlLENBQUEsRUFBQTtrQkFDckIsb0JBQUEsTUFBSyxFQUFBLElBQUMsRUFBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFnQixDQUFBO2dCQUNyQyxDQUFBLEVBQUE7Z0JBQ04sb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBRSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFLEdBQUcsUUFBVSxDQUFBLEVBQUE7a0JBQ3RELG9CQUFBLEdBQUUsRUFBQSxDQUFBLENBQUMsSUFBQSxFQUFJLENBQUMsR0FBQSxFQUFHLENBQUMsT0FBQSxFQUFPLENBQUUsSUFBSSxDQUFDLGtCQUFvQixDQUFBLEVBQUEsUUFBVSxDQUFBLEVBQUEsR0FBQSxFQUFBO0FBQUEsa0JBQ3hELG9CQUFBLEdBQUUsRUFBQSxDQUFBLENBQUMsSUFBQSxFQUFJLENBQUMsR0FBQSxFQUFHLENBQUMsT0FBQSxFQUFPLENBQUUsSUFBSSxDQUFDLGtCQUFvQixDQUFBLEVBQUEsUUFBVSxDQUFBO2dCQUNwRCxDQUFBO2NBQ0YsQ0FBQTtZQUNILENBQUEsRUFBQTtZQUNMLG9CQUFBLElBQUcsRUFBQSxJQUFDLEVBQUE7Y0FDRixvQkFBQSxPQUFNLEVBQUEsQ0FBQSxDQUFDLElBQUEsRUFBSSxDQUFDLFVBQUEsRUFBVSxDQUFDLElBQUEsRUFBSSxDQUFDLFFBQUEsRUFBUSxDQUFDLEtBQUEsRUFBSyxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUcsQ0FBRSxDQUFBLEVBQUE7Y0FDbkUsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQywyQkFBNEIsQ0FBQSxFQUFBO2dCQUN6QyxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLDRCQUFBLEVBQTRCLENBQUMsR0FBQSxFQUFHLENBQUMsRUFBQSxFQUFFLENBQUMsR0FBQSxFQUFHLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBUSxDQUFFLENBQUE7Y0FDaEYsQ0FBQSxFQUFBO2NBQ04sb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyx5QkFBMEIsQ0FBQSxFQUFBO2dCQUN2QyxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLHlCQUEwQixDQUFBLEVBQUE7a0JBQ3ZDLG9CQUFBLE1BQUssRUFBQSxJQUFDLEVBQUEsVUFBZSxDQUFBLEVBQUE7a0JBQ3JCLG9CQUFBLE1BQUssRUFBQSxJQUFDLEVBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBZ0IsQ0FBQTtnQkFDckMsQ0FBQSxFQUFBO2dCQUNOLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUUsQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRSxHQUFHLFFBQVUsQ0FBQSxFQUFBO2tCQUN0RCxvQkFBQSxHQUFFLEVBQUEsQ0FBQSxDQUFDLElBQUEsRUFBSSxDQUFDLEdBQUEsRUFBRyxDQUFDLE9BQUEsRUFBTyxDQUFFLElBQUksQ0FBQyxrQkFBb0IsQ0FBQSxFQUFBLFFBQVUsQ0FBQSxFQUFBLEdBQUEsRUFBQTtBQUFBLGtCQUN4RCxvQkFBQSxHQUFFLEVBQUEsQ0FBQSxDQUFDLElBQUEsRUFBSSxDQUFDLEdBQUEsRUFBRyxDQUFDLE9BQUEsRUFBTyxDQUFFLElBQUksQ0FBQyxrQkFBb0IsQ0FBQSxFQUFBLFFBQVUsQ0FBQTtnQkFDcEQsQ0FBQTtjQUNGLENBQUE7WUFDSCxDQUFBO1VBQ0YsQ0FBQTtRQUNELENBQUE7TUFDRixDQUFBO01BQ047R0FDSDtBQUNILENBQUMsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxHQUFHLEVBQUU7O0VBRTdCLE1BQU0sR0FBRyxHQUFHLENBQUM7RUFDYixNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztFQUN2QixXQUFXLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7QUFDMUMsRUFBRSxZQUFZLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUM7O0VBRTNDLE9BQU8sVUFBVSxDQUFDO0NBQ25CLENBQUM7OztBQ2hIRixPQUFPO0FBQ1AsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU3QixtQkFBbUI7QUFDbkIsSUFBSSxNQUFNLENBQUM7QUFDWCxJQUFJLE1BQU0sQ0FBQztBQUNYLElBQUksWUFBWSxDQUFDOztBQUVqQixhQUFhO0FBQ2IsSUFBSSxpQ0FBaUMsMkJBQUE7RUFDbkMsZUFBZSxFQUFFLFdBQVc7SUFDMUIsT0FBTztNQUNMLE9BQU8sRUFBRSxZQUFZLENBQUMsVUFBVSxFQUFFO0tBQ25DLENBQUM7QUFDTixHQUFHOztFQUVELE1BQU0sRUFBRSxXQUFXO0lBQ2pCO01BQ0Usb0JBQUEsS0FBSSxFQUFBLElBQUMsRUFBQTtRQUNILG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsY0FBZSxDQUFBLEVBQUE7QUFBQSxVQUFBLFFBQUE7QUFBQSxRQUV4QixDQUFBLEVBQUE7UUFDTixvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGFBQWMsQ0FBQSxFQUFBO0FBQUEsVUFBQSwwREFBQTtBQUFBLFFBRXZCLENBQUEsRUFBQTtRQUNOLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsYUFBYyxDQUFBLEVBQUE7VUFDM0Isb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxhQUFjLENBQUEsRUFBQTtZQUMzQixvQkFBQSxJQUFHLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGNBQWUsQ0FBQSxFQUFBO2NBQzNCLG9CQUFBLElBQUcsRUFBQSxJQUFDLEVBQUE7Z0JBQ0Ysb0JBQUEsT0FBTSxFQUFBLENBQUEsQ0FBQyxJQUFBLEVBQUksQ0FBQyxXQUFBLEVBQVcsQ0FBQyxJQUFBLEVBQUksQ0FBQyxRQUFBLEVBQVEsQ0FBQyxLQUFBLEVBQUssQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFHLENBQUUsQ0FBQSxFQUFBO2dCQUNyRSxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLDRCQUE2QixDQUFBLEVBQUE7a0JBQzFDLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsNEJBQUEsRUFBNEIsQ0FBQyxHQUFBLEVBQUcsQ0FBQyxFQUFBLEVBQUUsQ0FBQyxHQUFBLEVBQUcsQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFRLENBQUUsQ0FBQTtnQkFDakYsQ0FBQSxFQUFBO2dCQUNOLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsMEJBQTJCLENBQUEsRUFBQTtrQkFDeEMsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQywwQkFBMkIsQ0FBQSxFQUFBO29CQUN2QyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFTO2tCQUN6QixDQUFBO2dCQUNGLENBQUE7Y0FDSCxDQUFBO1lBQ0YsQ0FBQTtVQUNELENBQUE7UUFDRixDQUFBO01BQ0YsQ0FBQTtNQUNOO0dBQ0g7QUFDSCxDQUFDLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsR0FBRyxFQUFFOztFQUU3QixNQUFNLEdBQUcsR0FBRyxDQUFDO0VBQ2IsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDekIsRUFBRSxZQUFZLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7O0VBRTFDLE9BQU8sV0FBVyxDQUFDO0NBQ3BCLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZSgnLi9wZXJzb25fZWRpdF9kZXRhaWwvbWFpbi5qcycpO1xuIiwiLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIExpYnNcbnZhciBqcXVlcnkgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBxID0gcmVxdWlyZShcInFcIik7XG5cbnZhciBnbG9iYWw7XG52YXIgc3RvcmVzO1xuXG5mdW5jdGlvbiBpbml0KG9wdHMsIGdibCkge1xuICBnbG9iYWwgPSBnYmw7XG4gIHN0b3JlcyA9IGdsb2JhbC5zdG9yZXM7XG59XG5cbi8vIFBpY3R1cmUgYWN0aW9uXG52YXIgYWN0aW9uID0ge1xuICBpbml0OiBpbml0LFxuICBzZWxlY3RQZXJzb246IHNlbGVjdFBlcnNvblxufTtcbm1vZHVsZS5leHBvcnRzID0gYWN0aW9uO1xuXG4vLyBDb21wb25lbnRzXG52YXIgZmluZFBlcnNvbk1vZGFsID0ganF1ZXJ5KCcuanMtZmluZC1wZXJzb24tbW9kYWwnKTtcbnZhciBzZWxlY3RCb3hDb250YWluZXIgPSBqcXVlcnkoJy5qcy1zZWxlY3QtcGVyc29uLWNvbnRhaW5lcicpO1xudmFyIHNlbGVjdFBlcnNvbkJ1dHRvbiA9IGpxdWVyeSgnLmpzLWNvbmZpcm0tc2VsZWN0LXBlcnNvbi1idXR0b24nKTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIEZ1bmN0aW9uc1xuZnVuY3Rpb24gY3JlYXRlU2VsZWN0Qm94KCkge1xuICBzZWxlY3RCb3hDb250YWluZXIuZW1wdHkoKTtcbiAgdmFyIHNlbGVjdEJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xuICBzZWxlY3RCb3ggPSBqcXVlcnkoc2VsZWN0Qm94KTtcbiAgc2VsZWN0Qm94LmFkZENsYXNzKCdqcy1maW5kLXBlcnNvbi1zZWxlY3QnKTtcbiAgc2VsZWN0Qm94LmNzcygnd2lkdGgnLCAnMTAwJScpO1xuICBzZWxlY3RCb3hDb250YWluZXIuYXBwZW5kKHNlbGVjdEJveCk7XG4gIHJldHVybiBzZWxlY3RCb3g7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRlbXBsYXRlUmVzdWx0KHBlcnNvbikge1xuICBpZiAoISFwZXJzb24uaWQpIHtcbiAgICB2YXIgZGl2ICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdiA9IGpxdWVyeShkaXYpO1xuICAgIGRpdi5hZGRDbGFzcygnZmluZHBlcnNvbi1yZXN1bHQtaXRlbScpO1xuICAgIHZhciBpbWdEaXYgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaW1nRGl2ID0ganF1ZXJ5KGltZ0Rpdik7XG4gICAgaW1nRGl2LmFkZENsYXNzKCdpbWctcm91bmRlZCcpO1xuICAgIHZhciBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBpbWcgPSBqcXVlcnkoaW1nKTtcbiAgICBpbWcuYXR0cignc3JjJywgcGVyc29uLnBpY3R1cmUpO1xuICAgIGltZy5hZGRDbGFzcygnaW1nLXJlc3BvbnNpdmUnKTtcbiAgICB2YXIgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBzcGFuID0ganF1ZXJ5KHNwYW4pO1xuICAgIHNwYW4uaHRtbChwZXJzb25bJ2Z1bGwtbmFtZSddKTtcblxuICAgIGltZ0Rpdi5hcHBlbmQoaW1nKTtcbiAgICBkaXYuYXBwZW5kKGltZ0Rpdik7XG4gICAgZGl2LmFwcGVuZChzcGFuKTtcblxuICAgIHJldHVybiBkaXY7XG4gIH1cblxuICByZXR1cm4gXCJcIjtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVGVtcGxhdGVTZWxlY3Rpb24ocGVyc29uKSB7XG4gIGlmICghIXBlcnNvbi5pZCkge1xuICAgIHZhciBkaXYgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2ID0ganF1ZXJ5KGRpdik7XG4gICAgZGl2LmFkZENsYXNzKCdmaW5kcGVyc29uLXNlbGVjdGVkLWl0ZW0nKTtcbiAgICB2YXIgaW1nRGl2ICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGltZ0RpdiA9IGpxdWVyeShpbWdEaXYpO1xuICAgIGltZ0Rpdi5hZGRDbGFzcygnaW1nLXJvdW5kZWQnKTtcbiAgICB2YXIgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgaW1nID0ganF1ZXJ5KGltZyk7XG4gICAgaW1nLmF0dHIoJ3NyYycsIHBlcnNvbi5waWN0dXJlKTtcbiAgICBpbWcuYWRkQ2xhc3MoJ2ltZy1yZXNwb25zaXZlJyk7XG4gICAgdmFyIHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgc3BhbiA9IGpxdWVyeShzcGFuKTtcbiAgICBzcGFuLmh0bWwocGVyc29uWydmdWxsLW5hbWUnXSk7XG5cbiAgICBpbWdEaXYuYXBwZW5kKGltZyk7XG4gICAgZGl2LmFwcGVuZChpbWdEaXYpO1xuICAgIGRpdi5hcHBlbmQoc3Bhbik7XG5cbiAgICByZXR1cm4gZGl2O1xuICB9XG5cbiAgcmV0dXJuIFwiVHlwZSBuYW1lIHRvIHNlbGVjdFwiO1xufVxuXG4vLyBTZWxlY3QgcGVyc29uIHdpdGggbW9kYWxcbi8vIFJldHVybnMgYSBwcm9taXNlLCByZXNvbHZlIHdoZW4gZmluaXNoIHNlbGVjdGlvbiwgcmVqZWN0IHdoZW4gbm90IHNlbGVjdFxuZnVuY3Rpb24gc2VsZWN0UGVyc29uKGRhdGEpIHtcbiAgcmV0dXJuIHEuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIGZ1bmN0aW9uIG1ha2VEYXRhKHBhcmFtcykge1xuICAgICAgaWYoISFwYXJhbXMudGVybSkge1xuICAgICAgICBkYXRhLnRlcm0gPSBwYXJhbXMudGVybTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByb2Nlc3NSZXN1bHRzKGRhdGEsIHBhZ2UpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlc3VsdHM6IGRhdGFcbiAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIGFqYXggPSB7XG4gICAgICB1cmw6ICcvcGVyc29uL2ZpbmQvbGlzdC9zaW1wbGUnLFxuICAgICAgZGF0YTogbWFrZURhdGEsXG4gICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgZGVsYXk6IDI1MCxcbiAgICAgIHByb2Nlc3NSZXN1bHRzOiBwcm9jZXNzUmVzdWx0c1xuICAgIH07XG5cbiAgICB2YXIgc2VsZWN0ZWRQZXJzb247XG5cbiAgICB2YXIgc2VsZWN0Qm94ID0gY3JlYXRlU2VsZWN0Qm94KCk7XG4gICAgc2VsZWN0Qm94LnNlbGVjdDIoe1xuICAgICAgYWpheDogYWpheCxcbiAgICAgIHBsYWNlaG9sZGVyOiAnU2VsZWN0JyxcbiAgICAgIHRlbXBsYXRlUmVzdWx0OiBjcmVhdGVUZW1wbGF0ZVJlc3VsdCxcbiAgICAgIHRlbXBsYXRlU2VsZWN0aW9uOiBjcmVhdGVUZW1wbGF0ZVNlbGVjdGlvblxuICAgIH0pO1xuICAgIHNlbGVjdEJveC5vbignc2VsZWN0MjpzZWxlY3QnLCBmdW5jdGlvbihlKXtcbiAgICAgIHNlbGVjdGVkUGVyc29uID0gZS5wYXJhbXMuZGF0YTtcbiAgICB9KTtcbiAgICBzZWxlY3RCb3gub24oJ3NlbGVjdDI6dW5zZWxlY3QnLCBmdW5jdGlvbihlKXtcbiAgICAgIHNlbGVjdGVkUGVyc29uID0gbnVsbDtcbiAgICB9KTtcblxuICAgIHVuYmluZE1vZGFsKCk7XG4gICAgZmluZFBlcnNvbk1vZGFsLm9uKCdoaWRlLmJzLm1vZGFsJywgZnVuY3Rpb24oKXtcbiAgICAgIHJlamVjdCgpO1xuICAgIH0pO1xuICAgIHNlbGVjdFBlcnNvbkJ1dHRvbi5jbGljayhmdW5jdGlvbigpe1xuICAgICAgdW5iaW5kTW9kYWwoKTtcbiAgICAgIGZpbmRQZXJzb25Nb2RhbC5tb2RhbCgnaGlkZScpO1xuICAgICAgaWYoISFzZWxlY3RlZFBlcnNvbikge1xuICAgICAgICByZXNvbHZlKHNlbGVjdGVkUGVyc29uKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlamVjdCgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGZpbmRQZXJzb25Nb2RhbC5tb2RhbCgnc2hvdycpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gdW5iaW5kTW9kYWwoKSB7XG4gIGZpbmRQZXJzb25Nb2RhbC51bmJpbmQoKTtcbiAgc2VsZWN0UGVyc29uQnV0dG9uLnVuYmluZCgpO1xufVxuIiwiLy8gR2xvYmFsIEFjdGlvbnNcbnZhciBhY3Rpb25zID0ge1xuICBQaWN0dXJlQWN0aW9uOiBudWxsLFxuICBQYXJlbnRBY3Rpb246IG51bGwsXG4gIEZpbmRQZXJzb25BY3Rpb246IG51bGxcbn07XG5tb2R1bGUuZXhwb3J0cyA9IGFjdGlvbnM7XG5cbi8vIEluaXQgRnVuY3Rpb25zXG5hY3Rpb25zLmluaXQgPSBmdW5jdGlvbihvcHRzLCBnbG9iYWwpIHtcbiAgLy8gQXNzaWduXG4gIHRoaXMuUGljdHVyZUFjdGlvbiA9IHJlcXVpcmUoJy4vcGljdHVyZV9hY3Rpb24uanMnKTtcbiAgdGhpcy5QYXJlbnRBY3Rpb24gPSByZXF1aXJlKCcuL3BhcmVudF9hY3Rpb24uanMnKTtcbiAgdGhpcy5GaW5kUGVyc29uQWN0aW9uID0gcmVxdWlyZSgnLi9maW5kX3BlcnNvbl9hY3Rpb24uanMnKTtcblxuICAvLyBJbml0XG4gIHRoaXMuUGljdHVyZUFjdGlvbi5pbml0KG9wdHMsIGdsb2JhbCk7XG4gIHRoaXMuUGFyZW50QWN0aW9uLmluaXQob3B0cywgZ2xvYmFsKTtcbiAgdGhpcy5GaW5kUGVyc29uQWN0aW9uLmluaXQob3B0cywgZ2xvYmFsKTtcbn07XG4iLCIvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gTGlic1xudmFyIGpxdWVyeSA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIHEgPSByZXF1aXJlKFwicVwiKTtcblxudmFyIGdsb2JhbDtcbnZhciBzdG9yZXM7XG52YXIgUGFyZW50U3RvcmU7XG52YXIgRmluZFBlcnNvbkFjdGlvbjtcblxuZnVuY3Rpb24gaW5pdChvcHRzLCBnYmwpIHtcbiAgZ2xvYmFsID0gZ2JsO1xuICBzdG9yZXMgPSBnbG9iYWwuc3RvcmVzO1xuICBQYXJlbnRTdG9yZSA9IHN0b3Jlcy5QYXJlbnRTdG9yZTtcbiAgRmluZFBlcnNvbkFjdGlvbiA9IGdsb2JhbC5hY3Rpb25zLkZpbmRQZXJzb25BY3Rpb247XG59XG5cbi8vIFBpY3R1cmUgYWN0aW9uXG52YXIgYWN0aW9uID0ge1xuICBpbml0OiBpbml0XG59O1xubW9kdWxlLmV4cG9ydHMgPSBhY3Rpb247XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBTZWxlY3QgRnVuY3Rpb25zXG5hY3Rpb24uc2VsZWN0RmF0aGVyID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkYXRhID0ge307XG4gIGlmKFBhcmVudFN0b3JlLmlzTW90aGVyU2VsZWN0ZWQoKSkge1xuICAgIGRhdGEgPSB7XG4gICAgICBwYXJlbnRJZDogUGFyZW50U3RvcmUuZ2V0TW90aGVyKCkuaWRcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIGRhdGEgPSB7XG4gICAgICBwYXJlbnRSb2xlOiAnZmF0aGVyJ1xuICAgIH07XG4gIH1cbiAgRmluZFBlcnNvbkFjdGlvbi5zZWxlY3RQZXJzb24oZGF0YSkudGhlbihmdW5jdGlvbihwZXJzb24pe1xuICAgIFBhcmVudFN0b3JlLnNldEZhdGhlcihwZXJzb24pO1xuICB9KTtcbn07XG5cbmFjdGlvbi5zZWxlY3RNb3RoZXIgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGRhdGEgPSB7fTtcbiAgaWYoUGFyZW50U3RvcmUuaXNGYXRoZXJTZWxlY3RlZCgpKSB7XG4gICAgZGF0YSA9IHtcbiAgICAgIHBhcmVudElkOiBQYXJlbnRTdG9yZS5nZXRGYXRoZXIoKS5pZFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgZGF0YSA9IHtcbiAgICAgIHBhcmVudFJvbGU6ICdtb3RoZXInXG4gICAgfTtcbiAgfVxuICBGaW5kUGVyc29uQWN0aW9uLnNlbGVjdFBlcnNvbihkYXRhKS50aGVuKGZ1bmN0aW9uKHBlcnNvbil7XG4gICAgUGFyZW50U3RvcmUuc2V0TW90aGVyKHBlcnNvbik7XG4gIH0pO1xufTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFJlbW92ZSBGdW5jdGlvbnNcbmFjdGlvbi5yZW1vdmVNb3RoZXIgPSBmdW5jdGlvbigpIHtcbiAgUGFyZW50U3RvcmUucmVtb3ZlTW90aGVyKCk7XG59O1xuXG5hY3Rpb24ucmVtb3ZlRmF0aGVyID0gZnVuY3Rpb24oKSB7XG4gIFBhcmVudFN0b3JlLnJlbW92ZUZhdGhlcigpO1xufTtcbiIsIi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBMaWJzXG52YXIganF1ZXJ5ID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgcSA9IHJlcXVpcmUoXCJxXCIpO1xuXG52YXIgZ2xvYmFsO1xudmFyIHN0b3JlcztcbnZhciBQZXJzb25TdG9yZTtcblxuZnVuY3Rpb24gaW5pdChvcHRzLCBnYmwpIHtcbiAgZ2xvYmFsID0gZ2JsO1xuICBzdG9yZXMgPSBnbG9iYWwuc3RvcmVzO1xuICBQZXJzb25TdG9yZSA9IHN0b3Jlcy5QZXJzb25TdG9yZTtcbn1cblxuLy8gUGljdHVyZSBhY3Rpb25cbnZhciBhY3Rpb24gPSB7XG4gIGluaXQ6IGluaXRcbn07XG5tb2R1bGUuZXhwb3J0cyA9IGFjdGlvbjtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIG9wZW4gZmlsZSBpbnB1dCBzZWxlY3Rpb24gZm9yIHVzZXIgdG8gc2VsZWN0IGFuIGltYWdlXG4vLyBSZXR1cm5zIGEgcHJvbWlzZSwgcmVzb2x2ZSB3aXRoIHRoZSBpbWFnZSBsaW5rIGlmIHNlbGVjdGVkXG4vLyByZWplY3Qgb3RoZXJ3aXNlXG5mdW5jdGlvbiBzZWxlY3RGaWxlKCkge1xuICByZXR1cm4gcS5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgLy8gZmluZCB0aGUgcGljdHVyZSBpbnB1dFxuICAgIHZhciBwaWN0dXJlSW5wdXQgPSBqcXVlcnkoXCIuanMtcGljdHVyZS1pbnB1dFwiKTtcbiAgICAvLyByZW1vdmUgYWxsIGV2ZW50IGxpc3RlbmVyc1xuICAgIHBpY3R1cmVJbnB1dC51bmJpbmQoKTtcbiAgICAvLyBuZXcgZXZlbnQgaGFuZGxlclxuICAgIHBpY3R1cmVJbnB1dC5jaGFuZ2UoZnVuY3Rpb24oKXtcbiAgICAgIHZhciBmaWxlID0gcGljdHVyZUlucHV0WzBdLmZpbGVzWzBdO1xuICAgICAgaWYoISFmaWxlKSB7XG4gICAgICAgIGlmKCEhd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwpIHtcbiAgICAgICAgICB2YXIgaW1hZ2VMaW5rID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSk7XG4gICAgICAgICAgcmVzb2x2ZShpbWFnZUxpbmspO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlamVjdCgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBub3Qgc2VsZWN0XG4gICAgICAgIHJlamVjdCgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIC8vIHRyaWdnZXIgc2VsZWN0aW9uXG4gICAgcGljdHVyZUlucHV0LnRyaWdnZXIoXCJjbGlja1wiKTtcbiAgfSk7XG59XG5cbi8vIFNlbGVjdCBwaWN0dXJlXG5hY3Rpb24uc2VsZWN0UGljdHVyZSA9IGZ1bmN0aW9uKCkge1xuICBzZWxlY3RGaWxlKCkudGhlbihmdW5jdGlvbih1cmwpe1xuICAgIFBlcnNvblN0b3JlLnNldFBpY3R1cmUodXJsKTtcbiAgfSk7XG59O1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gUmVtb3ZlIHBpY3R1cmVcbmFjdGlvbi5yZW1vdmVQaWN0dXJlID0gZnVuY3Rpb24oKSB7XG4gIFBlcnNvblN0b3JlLnJlbW92ZVBpY3R1cmUoKTtcbn07XG4iLCIvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gQ29uc3RcbnZhciBBQ1RJT05fQUREID0gXCJhZGRcIjtcbnZhciBBQ1RJT05fRURJVCA9IFwiZWRpdFwiO1xudmFyIEZST01fUEFSRU5UID0gXCJwYXJlbnRcIjtcbnZhciBGUk9NX1BBUlRORVIgPSBcInBhcnRuZXJcIjtcbnZhciBGUk9NX0NISUxEID0gXCJjaGlsZFwiO1xudmFyIEZST01fTk9ORSA9IFwibm9uZVwiO1xudmFyIEZST01fSFVTQkFORCA9IFwiaHVzYmFuZFwiO1xudmFyIEZST01fV0lGRSA9IFwid2lmZVwiO1xudmFyIEZST01fRkFUSEVSID0gXCJmYXRoZXJcIjtcbnZhciBGUk9NX01PVEhFUiA9IFwibW90aGVyXCI7XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBHbG9iYWwgQ29uZmlnXG52YXIgY29uZmlnID0ge1xuICBhY3Rpb25MaW5rOiBudWxsLFxuICBmcm9tUGVyc29uOiBudWxsLFxuICBmcm9tUGFydG5lcjogbnVsbCxcbiAgZnJvbVBhcmVudDogbnVsbCxcbiAgc3RhdHVzZXNMaXN0OiBudWxsLFxuICBnZW5kZXJzTGlzdDogbnVsbFxufTtcbm1vZHVsZS5leHBvcnRzID0gY29uZmlnO1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gSW5pdCBGdW5jdGlvbnNcbmNvbmZpZy5pbml0ID0gZnVuY3Rpb24ob3B0cywgZ2xvYmFsKSB7XG4gIHRoaXMuaW5pdEFjdGlvbihvcHRzKTtcbiAgdGhpcy5pbml0RGlzcGxheURhdGEob3B0cyk7XG59O1xuXG5jb25maWcuaW5pdERpc3BsYXlEYXRhID0gZnVuY3Rpb24ob3B0cykge1xuICB0aGlzLnN0YXR1c2VzTGlzdCA9IG9wdHMuc3RhdHVzZXNMaXN0O1xuICB0aGlzLmdlbmRlcnNMaXN0ID0gb3B0cy5nZW5kZXJzTGlzdDtcbn07XG5cbmNvbmZpZy5pbml0QWN0aW9uID0gZnVuY3Rpb24ob3B0cykge1xuICB2YXIgYWN0aW9uID0gb3B0cy5hY3Rpb247XG5cbiAgaWYgKGFjdGlvbiA9PT0gQUNUSU9OX0FERCkge1xuICAgIHRoaXMuYWN0aW9uID0gQUNUSU9OX0FERDtcbiAgICB0aGlzLmFjdGlvbkxpbmsgPSBcIi9wZXJzb24vYWRkL3Byb2Nlc3NcIjtcbiAgICB0aGlzLmluaXRBZGRQYWdlKG9wdHMpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuYWN0aW9uID0gQUNUSU9OX0VESVQ7XG4gICAgdGhpcy5hY3Rpb25MaW5rID0gXCIvcGVyc29uL2VkaXRQcm9jZXNzXCI7XG4gICAgdGhpcy5pbml0RWRpdFBhZ2Uob3B0cyk7XG4gIH1cbn07XG5cbmNvbmZpZy5pbml0QWRkUGFnZSA9IGZ1bmN0aW9uKG9wdHMpIHtcbiAgdmFyIGZyb21QZXJzb24gPSBvcHRzLmZyb21QZXJzb247XG5cbiAgc3dpdGNoKGZyb21QZXJzb24pIHtcbiAgY2FzZSBGUk9NX1BBUkVOVDpcbiAgICB0aGlzLmluaXRBZGRGcm9tUGFyZW50KG9wdHMpO1xuICAgIGJyZWFrO1xuICBjYXNlIEZST01fUEFSVE5FUjpcbiAgICB0aGlzLmluaXRBZGRGcm9tUGFydG5lcihvcHRzKTtcbiAgICBicmVhaztcbiAgY2FzZSBGUk9NX0NISUxEOlxuICAgIGJyZWFrO1xuICBkZWZhdWx0OlxuICAgIGZyb21QZXJzb24gPSBGUk9NX05PTkU7XG4gIH1cblxuICB0aGlzLmZyb21QZXJzb24gPSBmcm9tUGVyc29uO1xufTtcblxuY29uZmlnLmluaXRBZGRGcm9tUGFyZW50ID0gZnVuY3Rpb24ob3B0cykge1xuICB2YXIgcGFyZW50ID0gb3B0cy5wYXJlbnQ7XG4gIGlmICghIXBhcmVudC5mYXRoZXIpIHtcbiAgICB0aGlzLmZyb21QYXJlbnQgPSBGUk9NX0ZBVEhFUjtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmZyb21QYXJlbnQgPSBGUk9NX01PVEhFUjtcbiAgfVxufTtcblxuY29uZmlnLmluaXRBZGRGcm9tUGFydG5lciA9IGZ1bmN0aW9uKG9wdHMpIHtcbiAgdmFyIHBhcnRuZXIgPSBvcHRzLnBhcnRuZXI7XG5cbiAgaWYoISFwYXJ0bmVyKSB7XG4gICAgaWYoISFwYXJ0bmVyLmh1c2JhbmQpIHtcbiAgICAgIHRoaXMuZnJvbVBhcnRuZXIgPSBGUk9NX0hVU0JBTkQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZnJvbVBhcnRuZXIgPSBGUk9NX1dJRkU7XG4gICAgfVxuICB9XG59O1xuXG5jb25maWcuaW5pdEVkaXRQYWdlID0gZnVuY3Rpb24ob3B0cykge1xuXG59O1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gR2V0IEZ1bmN0aW9uc1xuY29uZmlnLmdldEZvcm1BY3Rpb25MaW5rID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmFjdGlvbkxpbms7XG59O1xuXG5jb25maWcuZ2V0RnJvbVBlcnNvbiA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5mcm9tUGVyc29uO1xufTtcblxuY29uZmlnLmdldFN0YXR1c2VzTGlzdCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5zdGF0dXNlc0xpc3Q7XG59O1xuXG5jb25maWcuZ2V0R2VuZGVyc0xpc3QgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZ2VuZGVyc0xpc3Q7XG59O1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gUHJlZGljYXRlIEZ1bmN0aW9uc1xuY29uZmlnLmlzQWRkUGFnZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5hY3Rpb24gPT09IEFDVElPTl9BREQ7XG59O1xuXG5jb25maWcuaXNFZGl0UGFnZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5hY3Rpb24gPT09IEFDVElPTl9FRElUO1xufTtcblxuY29uZmlnLmlzRnJvbVBhcmVudCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5mcm9tUGVyc29uID09PSBGUk9NX1BBUkVOVDtcbn07XG5cbmNvbmZpZy5pc0Zyb21QYXJ0bmVyID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmZyb21QZXJzb24gPT09IEZST01fUEFSVE5FUjtcbn07XG5cbmNvbmZpZy5pc0Zyb21DaGlsZCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5mcm9tUGVyc29uID09PSBGUk9NX0NISUxEO1xufTtcblxuY29uZmlnLmlzRnJvbU5vbmUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZnJvbVBlcnNvbiA9PT0gRlJPTV9OT05FO1xufTtcblxuY29uZmlnLmlzRnJvbUh1c2JhbmQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZnJvbVBhcnRuZXIgPT09IEZST01fSFVTQkFORDtcbn07XG5cbmNvbmZpZy5pc0Zyb21XaWZlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmZyb21QYXJ0bmVyID09PSBGUk9NX1dJRkU7XG59O1xuXG5jb25maWcuaXNGcm9tRmF0aGVyID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmZyb21QYXJlbnQgPT09IEZST01fRkFUSEVSO1xufTtcblxuY29uZmlnLmlzRnJvbU1vdGhlciA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5mcm9tUGFyZW50ID09PSBGUk9NX01PVEhFUjtcbn07XG4iLCIvLyBMaWJzXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIGZsdXggPSByZXF1aXJlKFwiZmx1eFwiKTtcblxuLy8gRGF0YVxudmFyIHN0YXR1c2VzID0gd2luZG93LnN0YXR1c2VzO1xudmFyIGdlbmRlcnMgPSB3aW5kb3cuZ2VuZGVycztcbnZhciBwYXJlbnQgPSB3aW5kb3cucGFyZW50O1xudmFyIHBhcnRuZXIgPSB3aW5kb3cucGFydG5lcjtcbnZhciBjaGlsZCA9IHdpbmRvdy5jaGlsZDtcbnZhciBwZXJzb24gPSB3aW5kb3cucGVyc29uO1xudmFyIGZpbmRQZXJzb25MaXN0ID0gd2luZG93LmZpbmRQZXJzb25MaXN0O1xudmFyIGZyb21QZXJzb24gPSB3aW5kb3cuZnJvbVBlcnNvbjtcbnZhciBhY3Rpb24gPSB3aW5kb3cuZm9ybUFjdGlvbjtcblxudmFyIGdsb2JhbCA9IHt9O1xuXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcuanMnKTtcbmdsb2JhbC5jb25maWcgPSBjb25maWc7XG5jb25maWcuaW5pdCh7XG4gIGFjdGlvbjogYWN0aW9uLFxuICBmcm9tUGVyc29uOiBmcm9tUGVyc29uLFxuICBzdGF0dXNlc0xpc3Q6IHN0YXR1c2VzLFxuICBnZW5kZXJzTGlzdDogZ2VuZGVycyxcbiAgcGFydG5lcjogcGFydG5lcixcbiAgcGFyZW50OiBwYXJlbnRcbn0sIGdsb2JhbCk7XG5cbnZhciBzdG9yZXMgPSByZXF1aXJlKCcuL3N0b3Jlcy9tYWluLmpzJyk7XG5nbG9iYWwuc3RvcmVzID0gc3RvcmVzO1xuc3RvcmVzLmluaXQoe1xuICBjaGlsZDogY2hpbGQsXG4gIHBhcnRuZXI6IHBhcnRuZXIsXG4gIHBhcmVudDogcGFyZW50LFxuICBwZXJzb246IHBlcnNvblxufSwgZ2xvYmFsKTtcblxudmFyIGFjdGlvbnMgPSByZXF1aXJlKCcuL2FjdGlvbnMvbWFpbi5qcycpO1xuZ2xvYmFsLmFjdGlvbnMgPSBhY3Rpb25zO1xuYWN0aW9ucy5pbml0KHt9LCBnbG9iYWwpO1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbC5qcycpO1xuZ2xvYmFsLnV0aWwgPSB1dGlsO1xuXG4vLyBSZW5kZXJcbnZhciBNYWluVmlldyA9IHJlcXVpcmUoJy4vdmlld3MvbWFpbl92aWV3LmpzeCcpKGdsb2JhbCk7XG5SZWFjdC5yZW5kZXIoXG4gIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWFpblZpZXcsIHt9KSxcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLWVkaXRwZXJzb24tY29udGFpbmVyJylcbik7XG4iLCIvLyBMaWJzXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbC5qcycpO1xuXG5mdW5jdGlvbiBpbml0KG9wdHMpIHtcbiAgdmFyIGNoaWxkID0gb3B0cy5jaGlsZDtcblxuICBpZighIWNoaWxkKSB7XG4gICAgY2hpbGQgPSB1dGlsLm5vcm1hbGl6ZVBlcnNvbihjaGlsZCk7XG4gIH1cbiAgdGhpcy5jaGlsZCA9IGNoaWxkO1xuXG4gIHJldHVybiB0aGlzO1xufVxuXG5mdW5jdGlvbiBnZXRDaGlsZCgpIHtcbiAgcmV0dXJuIHRoaXMuY2hpbGQ7XG59XG5cbi8vIENoaWxkIFN0b3JlXG52YXIgc3RvcmUgPSB7XG4gIC8vIGRhdGFcbiAgY2hpbGQ6IG51bGwsXG5cbiAgLy8gZnVuY3NcbiAgaW5pdDogaW5pdCxcbiAgZ2V0Q2hpbGQ6IGdldENoaWxkXG59O1xubW9kdWxlLmV4cG9ydHMgPSBzdG9yZTtcbiIsIi8vIEdsb2JhbCBTdG9yZXNcbnZhciBzdG9yZXMgPSB7XG4gIENoaWxkU3RvcmU6IG51bGwsXG4gIFBhcnRuZXJTdG9yZTogbnVsbCxcbiAgUGFyZW50U3RvcmU6IG51bGwsXG4gIFBlcnNvblN0b3JlOiBudWxsXG59O1xubW9kdWxlLmV4cG9ydHMgPSBzdG9yZXM7XG5cbi8vIEluaXQgRnVuY3Rpb25zXG5zdG9yZXMuaW5pdCA9IGZ1bmN0aW9uKG9wdHMsIGdsb2JhbCkge1xuICAvLyBBc3NpZ25cbiAgdmFyIGNvbmZpZyA9IGdsb2JhbC5jb25maWc7XG4gIHRoaXMuQ2hpbGRTdG9yZSA9IHJlcXVpcmUoJy4vY2hpbGRfc3RvcmUuanMnKTtcbiAgdGhpcy5QYXJ0bmVyU3RvcmUgPSByZXF1aXJlKCcuL3BhcnRuZXJfc3RvcmUuanMnKTtcbiAgdGhpcy5QYXJlbnRTdG9yZSA9IHJlcXVpcmUoJy4vcGFyZW50X3N0b3JlLmpzJyk7XG4gIHRoaXMuUGVyc29uU3RvcmUgPSByZXF1aXJlKCcuL3BlcnNvbl9zdG9yZS5qcycpO1xuXG4gIC8vIGluaXRcbiAgdGhpcy5QZXJzb25TdG9yZS5pbml0KG9wdHMpO1xuICBpZiAoY29uZmlnLmlzRnJvbUNoaWxkKCkpIHtcbiAgICB0aGlzLkNoaWxkU3RvcmUuaW5pdChvcHRzKTtcbiAgfVxuICBpZiAoY29uZmlnLmlzRnJvbVBhcnRuZXIoKSkge1xuICAgIHRoaXMuUGFydG5lclN0b3JlLmluaXQob3B0cyk7XG4gIH1cbiAgaWYgKGNvbmZpZy5pc0Zyb21QYXJlbnQoKSkge1xuICAgIHRoaXMuUGFyZW50U3RvcmUuaW5pdChvcHRzKTtcbiAgfVxufTtcbiIsIi8vIExpYnNcbnZhciBtaWNyb0V2ZW50ID0gcmVxdWlyZSgnbWljcm9ldmVudCcpO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwuanMnKTtcblxuLy9cbmZ1bmN0aW9uIGluaXQob3B0cykge1xuICB2YXIgcGFyZW50ID0gb3B0cy5wYXJlbnQ7XG4gIHZhciBmYXRoZXI7XG4gIHZhciBtb3RoZXI7XG5cbiAgaWYoISFwYXJlbnQpIHtcbiAgICBpZighIXBhcmVudC5mYXRoZXIpIHtcbiAgICAgIC8vIGFkZCBmcm9tIGZhdGhlclxuICAgICAgZmF0aGVyID0gdXRpbC5ub3JtYWxpemVQZXJzb24ocGFyZW50LmZhdGhlcik7XG4gICAgICBtb3RoZXIgPSB1dGlsLmdldFBlcnNvbigpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBhZGQgZnJvbSBtb3RoZXJcbiAgICAgIG1vdGhlciA9IHV0aWwubm9ybWFsaXplUGVyc29uKHBhcmVudC5tb3RoZXIpO1xuICAgICAgZmF0aGVyID0gdXRpbC5nZXRQZXJzb24oKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZmF0aGVyID0gdXRpbC5nZXRQZXJzb24oKTtcbiAgICBtb3RoZXIgPSB1dGlsLmdldFBlcnNvbigpO1xuICB9XG4gIHRoaXMuZmF0aGVyID0gZmF0aGVyO1xuICB0aGlzLm1vdGhlciA9IG1vdGhlcjtcblxuICByZXR1cm4gdGhpcztcbn1cblxuLy8gUGFyZW50IFN0b3JlXG52YXIgc3RvcmUgPSB7XG4gIC8vIGRhdGFcbiAgZmF0aGVyOiBudWxsLFxuICBtb3RoZXI6IG51bGwsXG5cbiAgLy8gZnVuY3NcbiAgaW5pdDogaW5pdFxufTtcbm1vZHVsZS5leHBvcnRzID0gc3RvcmU7XG5cbm1pY3JvRXZlbnQubWl4aW4oc3RvcmUpO1xuXG4vLyBHZXQgRnVuY3Rpb25zXG5zdG9yZS5nZXRGYXRoZXIgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZmF0aGVyO1xufTtcblxuc3RvcmUuZ2V0TW90aGVyID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLm1vdGhlcjtcbn07XG5cbi8vIFNldCBGdW5jdGlvbnNcbnN0b3JlLnNldEZhdGhlciA9IGZ1bmN0aW9uKHBlcnNvbikge1xuICBwZXJzb24gPSB1dGlsLm5vcm1hbGl6ZVBlcnNvbihwZXJzb24pO1xuICB0aGlzLmZhdGhlciA9IHBlcnNvbjtcbiAgdGhpcy50cmlnZ2VyKCdjaGFuZ2UnKTtcbn07XG5cbnN0b3JlLnNldE1vdGhlciA9IGZ1bmN0aW9uKHBlcnNvbikge1xuICBwZXJzb24gPSB1dGlsLm5vcm1hbGl6ZVBlcnNvbihwZXJzb24pO1xuICB0aGlzLm1vdGhlciA9IHBlcnNvbjtcbiAgdGhpcy50cmlnZ2VyKCdjaGFuZ2UnKTtcbn07XG5cbi8vIFJlbW92ZSBGdW5jdGlvbnNcbnN0b3JlLnJlbW92ZUZhdGhlciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZmF0aGVyID0gdXRpbC5nZXRQZXJzb24oKTtcbiAgdGhpcy5mYXRoZXIgPSBmYXRoZXI7XG4gIHRoaXMudHJpZ2dlcignY2hhbmdlJyk7XG59O1xuXG5zdG9yZS5yZW1vdmVNb3RoZXIgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG1vdGhlciA9IHV0aWwuZ2V0UGVyc29uKCk7XG4gIHRoaXMubW90aGVyID0gbW90aGVyO1xuICB0aGlzLnRyaWdnZXIoJ2NoYW5nZScpO1xufTtcblxuLy8gUHJlZGljYXRlIEZ1bmN0aW9uc1xuc3RvcmUuaXNNb3RoZXJTZWxlY3RlZCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5tb3RoZXIuc2VsZWN0ZWQ7XG59O1xuXG5zdG9yZS5pc0ZhdGhlclNlbGVjdGVkID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmZhdGhlci5zZWxlY3RlZDtcbn07XG4iLCIvLyBMaWJzXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbC5qcycpO1xuXG5mdW5jdGlvbiBpbml0KG9wdHMpIHtcbiAgdmFyIHBhcnRuZXIgPSBvcHRzLnBhcnRuZXI7XG4gIHZhciBwZXJzb247XG5cbiAgaWYoISFwYXJ0bmVyLmh1c2JhbmQpIHtcbiAgICBwZXJzb24gPSBwYXJ0bmVyLmh1c2JhbmQ7XG4gIH0gZWxzZSB7XG4gICAgcGVyc29uID0gcGFydG5lci53aWZlO1xuICB9XG4gIHBlcnNvbiA9IHV0aWwubm9ybWFsaXplUGVyc29uKHBlcnNvbik7XG4gIHBlcnNvbi5jYW5SZW1vdmUgPSBmYWxzZTtcbiAgdGhpcy5wYXJ0bmVyID0gcGVyc29uO1xuXG4gIHJldHVybiB0aGlzO1xufVxuXG4vLyBQYXJ0bmVyIFN0b3JlXG52YXIgc3RvcmUgPSB7XG4gIC8vIGRhdGFcbiAgcGFydG5lcjogbnVsbCxcblxuICAvLyBmdW5jc1xuICBpbml0OiBpbml0XG59O1xubW9kdWxlLmV4cG9ydHMgPSBzdG9yZTtcblxuc3RvcmUuZ2V0UGFydG5lciA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5wYXJ0bmVyO1xufTtcbiIsIi8vIExpYnNcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsLmpzJyk7XG52YXIgbWljcm9FdmVudCA9IHJlcXVpcmUoJ21pY3JvZXZlbnQnKTtcbnZhciBfID0gcmVxdWlyZSgnXycpO1xuXG5mdW5jdGlvbiBpbml0KG9wdHMpIHtcbiAgdmFyIHBlcnNvbiA9IG9wdHMucGVyc29uO1xuXG4gIGlmICghIXBlcnNvbiAmJiAhXy5pc0VtcHR5KHBlcnNvbikpIHtcbiAgICBwZXJzb24gPSB1dGlsLm5vcm1hbGl6ZVBlcnNvbihwZXJzb24pO1xuICB9IGVsc2Uge1xuICAgIHBlcnNvbiA9IHV0aWwuZ2V0UGVyc29uKCk7XG4gICAgcGVyc29uLmZ1bGxOYW1lID0gXCJcIjtcbiAgfVxuICB0aGlzLnBlcnNvbiA9IHBlcnNvbjtcblxuICByZXR1cm4gdGhpcztcbn1cblxuLy8gUGVyc29uIFN0b3JlXG52YXIgc3RvcmUgPSB7XG4gIC8vIGRhdGFcbiAgcGVyc29uOiBudWxsLFxuXG4gIC8vIGZ1bmNzXG4gIGluaXQ6IGluaXRcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHN0b3JlO1xuXG4vLyBHZXQgRnVuY3Rpb25zXG5zdG9yZS5nZXRQZXJzb24gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMucGVyc29uO1xufTtcblxuLy8gVXBkYXRlIEZ1bmN0aW9uc1xuc3RvcmUuc2V0UGljdHVyZSA9IGZ1bmN0aW9uKGxpbmspIHtcbiAgdGhpcy5wZXJzb24ucGljdHVyZSA9IGxpbms7XG4gIHRoaXMudHJpZ2dlcignY2hhbmdlJyk7XG59O1xuXG5zdG9yZS5yZW1vdmVQaWN0dXJlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucGVyc29uLnBpY3R1cmUgPSBcIi9hc3NldHMvaW1nL3VzZXJiYXNpYy5qcGdcIjtcbiAgdGhpcy50cmlnZ2VyKCdjaGFuZ2UnKTtcbn07XG5cbnN0b3JlLnNldEFsaXZlU3RhdHVzID0gZnVuY3Rpb24oc3RhdHVzKSB7XG4gIHRoaXMucGVyc29uLmFsaXZlU3RhdHVzID0gc3RhdHVzO1xuICB0aGlzLnRyaWdnZXIoJ2NoYW5nZScpO1xufTtcblxubWljcm9FdmVudC5taXhpbihzdG9yZSk7XG4iLCJmdW5jdGlvbiBnZXRQZXJzb24oKSB7XG4gIHJldHVybiB7XG4gICAgaWQ6IG51bGwsXG4gICAgZnVsbE5hbWU6IFwiTm90IHNlbGVjdGVkXCIsXG4gICAgcGljdHVyZTogXCIvYXNzZXRzL2ltZy91c2VyYmFzaWMuanBnXCIsXG4gICAgYWRkcmVzczogbnVsbCxcbiAgICBwaG9uZU5vOiBudWxsLFxuICAgIHN1bW1hcnk6IG51bGwsXG4gICAgZ2VuZGVyOiBudWxsLFxuICAgIGFsaXZlU3RhdHVzOiBudWxsLFxuICAgIGJpcnRoRGF0ZTogbnVsbCxcbiAgICBkZWF0aERhdGU6IG51bGwsXG4gICAgY3JlYXRlZEF0OiBudWxsLFxuICAgIGpvYjogbnVsbCxcblxuICAgIHNlbGVjdGVkOiBmYWxzZSxcbiAgICBjYW5SZW1vdmU6IHRydWVcbiAgfTtcbn1cbmV4cG9ydHMuZ2V0UGVyc29uID0gZ2V0UGVyc29uO1xuXG5mdW5jdGlvbiBub3JtYWxpemVQZXJzb24ocGVyc29uKSB7XG4gIHZhciBmdWxsTmFtZSA9IHBlcnNvbi5mdWxsTmFtZSB8fCBwZXJzb24uZnVsbF9uYW1lIHx8IHBlcnNvblsnZnVsbC1uYW1lJ107XG4gIHZhciBwaG9uZU5vID0gcGVyc29uLnBob25lTm8gfHwgcGVyc29uLnBob25lX25vIHx8IHBlcnNvblsncGhvbmUtbm8nXTtcbiAgdmFyIGRlYXRoRGF0ZSA9IHBlcnNvbi5kZWF0aERhdGUgfHwgcGVyc29uLmRlYXRoX2RhdGUgfHwgcGVyc29uWydkZWF0aC1kYXRlJ107XG4gIHZhciBiaXJ0aERhdGUgPSBwZXJzb24uYmlydGhEYXRlIHx8IHBlcnNvbi5iaXJ0aF9kYXRlIHx8IHBlcnNvblsnYmlydGgtZGF0ZSddO1xuICB2YXIgY3JlYXRlZEF0ID0gcGVyc29uLmNyZWF0ZWRBdCB8fCBwZXJzb24uY3JlYXRlZF9hdCB8fCBwZXJzb25bJ2NyZWF0ZWQtYXQnXTtcbiAgdmFyIGFsaXZlU3RhdHVzID0gcGVyc29uLmFsaXZlU3RhdHVzIHx8IHBlcnNvbi5hbGl2ZV9zdGF0dXMgfHwgcGVyc29uWydhbGl2ZS1zdGF0dXMnXTtcblxuICByZXR1cm4ge1xuICAgIGlkOiBwZXJzb24uaWQsXG4gICAgZnVsbE5hbWU6IGZ1bGxOYW1lLFxuICAgIHBpY3R1cmU6IHBlcnNvbi5waWN0dXJlLFxuICAgIHNlbGVjdGVkOiB0cnVlLFxuICAgIGNhblJlbW92ZTogZmFsc2UsXG4gICAgcGhvbmVObzogcGhvbmVObyxcbiAgICBkZWF0aERhdGU6IGRlYXRoRGF0ZSxcbiAgICBiaXJ0aERhdGU6IGJpcnRoRGF0ZSxcbiAgICBjcmVhdGVkQXQ6IGNyZWF0ZWRBdCxcbiAgICBhZGRyZXNzOiBwZXJzb24uYWRkcmVzcyxcbiAgICBzdW1tYXJ5OiBwZXJzb24uc3VtbWFyeSxcbiAgICBnZW5kZXI6IHBlcnNvbi5nZW5kZXIsXG4gICAgYWxpdmVTdGF0dXM6IGFsaXZlU3RhdHVzLFxuICAgIGpvYjogcGVyc29uLmpvYlxuICB9O1xufVxuZXhwb3J0cy5ub3JtYWxpemVQZXJzb24gPSBub3JtYWxpemVQZXJzb247XG4iLCIvLyBMaWJzXG52YXIganF1ZXJ5ID0gcmVxdWlyZShcImpxdWVyeVwiKTtcblxuZnVuY3Rpb24gaW5pdERhdGVQaWNrZXIoKSB7XG4gIC8vIEZpbmQgY29tcG9uZW50c1xuICB2YXIgYmlydGhEYXRlSW5wdXQgPSBqcXVlcnkoJy5qcy1iaXJ0aGRhdGUtaW5wdXQnKTtcbiAgdmFyIGRlYXRoRGF0ZUlucHV0ID0ganF1ZXJ5KCcuanMtZGVhdGhkYXRlLWlucHV0Jyk7XG5cbiAgYmlydGhEYXRlSW5wdXQuZGF0ZXBpY2tlcih7XG4gICAgbGFuZ3VhZ2U6ICd2aSdcbiAgfSk7XG4gIGRlYXRoRGF0ZUlucHV0LmRhdGVwaWNrZXIoe1xuICAgIGxhbmd1YWdlOiAndmknXG4gIH0pO1xufVxuZXhwb3J0cy5pbml0RGF0ZVBpY2tlciA9IGluaXREYXRlUGlja2VyO1xuXG5mdW5jdGlvbiBpbml0U3VtbWFyeUVkaXRvcigpIHtcbiAgdmFyIGhpc3RvcnlFZGl0b3IgPSBqcXVlcnkoXCIuanMtaGlzdG9yeS1lZGl0b3JcIik7XG4gIGhpc3RvcnlFZGl0b3IubWFya2Rvd24oe1xuICAgIGljb25saWJyYXJ5OiBcImZhXCIsXG4gICAgcmVzaXplOiBcInZlcnRpY2FsXCIsXG4gICAgaGVpZ2h0OiAzMDBcbiAgfSk7XG59XG5leHBvcnRzLmluaXRTdW1tYXJ5RWRpdG9yID0gaW5pdFN1bW1hcnlFZGl0b3I7XG4iLCIvLyBMaWJzXG52YXIgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5cbi8vIEFwcGxpY2F0aW9uIERhdGFcbnZhciBnbG9iYWw7XG52YXIgY29uZmlnO1xudmFyIENoaWxkU3RvcmU7XG5cbi8vIFZpZXcgY2xhc3NcbnZhciBDaGlsZFZpZXcgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNoaWxkOiBDaGlsZFN0b3JlLmdldENoaWxkKClcbiAgICB9O1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmFtaWx5LWNvbnRhaW5lclwiPlxuICAgICAgICA8aW5wdXQgbmFtZT1cImNoaWxkSWRcIiB0eXBlPVwiaGlkZGVuXCIgdmFsdWU9e3RoaXMuc3RhdGUuY2hpbGQuaWR9Lz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmYW1pbHktdGl0bGVcIj5cbiAgICAgICAgICBDaGlsZFxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmYW1pbHktaGVscFwiPlxuICAgICAgICAgIExvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNpY2luZyBlbGl0XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZhbWlseS1ib2R5XCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmYW1pbHktbGlzdFwiPlxuICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cInBhcnRuZXItbGlzdFwiPlxuICAgICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYXJ0bmVyLWltYWdlIHBlb3BsZS1pbWFnZVwiPlxuICAgICAgICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJpbWctcmVzcG9uc2l2ZSBpbWctcm91bmRlZFwiIGFsdD1cIlwiIHNyYz17dGhpcy5zdGF0ZS5jaGlsZC5waWN0dXJlfS8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYXJ0bmVyLWluZm8gcGVvcGxlLWluZm9cIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFydG5lci1uYW1lIHBlb3BsZS1uYW1lXCI+XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnN0YXRlLmNoaWxkLmZ1bGxOYW1lfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGdibCkge1xuICAvLyBJbml0IGFwcGxpY2F0aW9uIGRhdGFcbiAgZ2xvYmFsID0gZ2JsO1xuICBjb25maWcgPSBnbG9iYWwuY29uZmlnO1xuICBDaGlsZFN0b3JlID0gZ2xvYmFsLnN0b3Jlcy5DaGlsZFN0b3JlO1xuXG4gIHJldHVybiBDaGlsZFZpZXc7XG59O1xuIiwiLy8gTGlic1xudmFyIFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xuXG4vLyBBcHBsaWNhdGlvbiBEYXRhXG52YXIgZ2xvYmFsO1xudmFyIGNvbmZpZztcbnZhciBQZXJzb25TdG9yZTtcbnZhciBQaWN0dXJlQWN0aW9uO1xuXG4vLyBWaWV3IGNsYXNzXG52YXIgQ29sMVZpZXcgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGltYWdlTGluazogUGVyc29uU3RvcmUuZ2V0UGVyc29uKCkucGljdHVyZVxuICAgIH07XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIFBlcnNvblN0b3JlLmJpbmQoXCJjaGFuZ2VcIiwgdGhpcy5waWN0dXJlQ2hhbmdlZCk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIFBlcnNvblN0b3JlLnVuYmluZChcImNoYW5nZVwiLCB0aGlzLnBpY3R1cmVDaGFuZ2VkKTtcbiAgfSxcblxuICBwaWN0dXJlQ2hhbmdlZDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpbWFnZUxpbms6IFBlcnNvblN0b3JlLmdldFBlcnNvbigpLnBpY3R1cmVcbiAgICB9KTtcbiAgfSxcblxuICBoYW5kbGVTZWxlY3RJbWFnZTogZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBQaWN0dXJlQWN0aW9uLnNlbGVjdFBpY3R1cmUoKTtcbiAgfSxcblxuICBoYW5kbGVEZWxldGVJbWFnZTogZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBQaWN0dXJlQWN0aW9uLnJlbW92ZVBpY3R1cmUoKTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImVkaXRwZXJzb24tY29sLTFcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtMS1pbWdcIj5cbiAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImltZy1yZXNwb25zaXZlIGltZy10aHVtYm5haWxcIiBhbHQ9XCJcIiBzcmM9e3RoaXMuc3RhdGUuaW1hZ2VMaW5rfS8+XG4gICAgICAgICAgPGlucHV0IHJlZj1cInBpY3R1cmVJbnB1dFwiIG5hbWU9XCJwaWN0dXJlXCJcbiAgICAgICAgICAgICAgICAgdHlwZT1cImZpbGVcIiBhY2NlcHQ9XCJpbWFnZS8qXCIgY2xhc3NOYW1lPVwiaGlkZGVuIGpzLXBpY3R1cmUtaW5wdXRcIi8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC0xLWJ1dHRvbnNcIj5cbiAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3RoaXMuaGFuZGxlU2VsZWN0SW1hZ2V9XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXN1Y2Nlc3NcIj5TZWxlY3Q8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3RoaXMuaGFuZGxlRGVsZXRlSW1hZ2V9IGNsYXNzTmFtZT1cImJ0biBidG4tZGFuZ2VyXCI+RGVsZXRlPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZ2JsKSB7XG4gIC8vIEluaXQgYXBwbGljYXRpb24gZGF0YVxuICBnbG9iYWwgPSBnYmw7XG4gIGNvbmZpZyA9IGdsb2JhbC5jb25maWc7XG4gIFBlcnNvblN0b3JlID0gZ2xvYmFsLnN0b3Jlcy5QZXJzb25TdG9yZTtcbiAgUGljdHVyZUFjdGlvbiA9IGdsb2JhbC5hY3Rpb25zLlBpY3R1cmVBY3Rpb247XG5cbiAgcmV0dXJuIENvbDFWaWV3O1xufTtcbiIsIi8vIExpYnNcbnZhciBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbnZhciBfID0gcmVxdWlyZShcIl9cIik7XG5cbi8vIEFwcGxpY2F0aW9uIERhdGFcbnZhciBnbG9iYWw7XG52YXIgc3RvcmVzO1xudmFyIGNvbmZpZztcbnZhciB1dGlsO1xudmFyIFBlcnNvblN0b3JlO1xuXG4vLyBWaWV3IGNsYXNzXG52YXIgQ29sMlZpZXcgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBlcnNvbjogUGVyc29uU3RvcmUuZ2V0UGVyc29uKClcbiAgICB9O1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICBQZXJzb25TdG9yZS5iaW5kKFwiY2hhbmdlXCIsIHRoaXMucGVyc29uQ2hhbmdlZCk7XG4gICAgdXRpbC5pbml0RGF0ZVBpY2tlcigpO1xuICAgIHV0aWwuaW5pdFN1bW1hcnlFZGl0b3IoKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gICAgUGVyc29uU3RvcmUudW5iaW5kKFwiY2hhbmdlXCIsIHRoaXMucGVyc29uQ2hhbmdlZCk7XG4gIH0sXG5cbiAgaGFuZGxlU3RhdHVzQ2hhbmdlOiBmdW5jdGlvbihlKSB7XG4gICAgdmFyIHN0YXR1cyA9IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5zdGF0dXNlcykudmFsdWUudHJpbSgpO1xuICAgIFBlcnNvblN0b3JlLnNldEFsaXZlU3RhdHVzKHN0YXR1cyk7XG4gIH0sXG5cbiAgcGVyc29uQ2hhbmdlZDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7cGVyc29uOiBQZXJzb25TdG9yZS5nZXRQZXJzb24oKX0pO1xuICB9LFxuXG4gIHJlbmRlclN0YXR1c2VzOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3RhdHVzZXMgPSBfLm1hcChjb25maWcuZ2V0U3RhdHVzZXNMaXN0KCksIGZ1bmN0aW9uKHYsIGspe1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPG9wdGlvbiBrZXk9e2t9IHZhbHVlPXtrfT57dn08L29wdGlvbj5cbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPHNlbGVjdCBuYW1lPVwic3RhdHVzXCIgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXt0aGlzLnN0YXRlLnBlcnNvbi5hbGl2ZVN0YXR1c31cbiAgICAgICAgICAgICAgcmVmPVwic3RhdHVzZXNcIiBvbkNoYW5nZT17dGhpcy5oYW5kbGVTdGF0dXNDaGFuZ2V9PlxuICAgICAgICB7c3RhdHVzZXN9XG4gICAgICA8L3NlbGVjdD5cbiAgICApO1xuICB9LFxuXG4gIHJlbmRlckdlbmRlcnM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBnZW5kZXJzID0gXy5tYXAoY29uZmlnLmdldEdlbmRlcnNMaXN0KCksIGZ1bmN0aW9uKHYsIGspe1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPG9wdGlvbiBrZXk9e2t9IHZhbHVlPXtrfT57dn08L29wdGlvbj5cbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPHNlbGVjdCBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU9e3RoaXMuc3RhdGUucGVyc29uLmdlbmRlcn1cbiAgICAgICAgICAgICAgbmFtZT1cImdlbmRlclwiPlxuICAgICAgICB7Z2VuZGVyc31cbiAgICAgIDwvc2VsZWN0PlxuICAgICk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3RhdHVzZXNWaWV3ID0gdGhpcy5yZW5kZXJTdGF0dXNlcygpO1xuICAgIHZhciBnZW5kZXJzVmlldyA9IHRoaXMucmVuZGVyR2VuZGVycygpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZWRpdHBlcnNvbi1jb2wtMlwiPlxuICAgICAgICA8aW5wdXQgbmFtZT1cInBlcnNvbmlkXCIgdHlwZT1cImhpZGRlblwiIHZhbHVlPXt0aGlzLnN0YXRlLnBlcnNvbi5pZH0gLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcm9maWxlLWNvbnRhaW5lclwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHJvZmlsZS1oZWFkZXJcIj5cbiAgICAgICAgICAgIEjhu5Mgc8ahXG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByb2ZpbGUtYm9keVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcm9maWxlLWJvZHktcm93XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHJvZmlsZS1ib2R5LWxlZnRcIj5cbiAgICAgICAgICAgICAgICBUw6puXG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByb2ZpbGUtYm9keS1yaWdodFwiPlxuICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBuYW1lPVwibmFtZVwiIHR5cGU9XCJ0ZXh0XCIgZGVmYXVsdFZhbHVlPXt0aGlzLnN0YXRlLnBlcnNvbi5mdWxsTmFtZX0gLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcm9maWxlLWJvZHktcm93XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHJvZmlsZS1ib2R5LWxlZnRcIj5cbiAgICAgICAgICAgICAgICBOZ8OgeSBzaW5oXG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByb2ZpbGUtYm9keS1yaWdodFwiPlxuICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2wganMtYmlydGhkYXRlLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXt0aGlzLnN0YXRlLnBlcnNvbi5iaXJ0aERhdGV9XG4gICAgICAgICAgICAgICAgICAgICAgIG5hbWU9XCJiaXJ0aGRhdGVcIiB0eXBlPVwidGV4dFwiLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcm9maWxlLWJvZHktcm93XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHJvZmlsZS1ib2R5LWxlZnRcIj5cbiAgICAgICAgICAgICAgICBUw6xuaCB0cuG6oW5nXG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByb2ZpbGUtYm9keS1yaWdodFwiPlxuICAgICAgICAgICAgICAgIHtzdGF0dXNlc1ZpZXd9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXsodGhpcy5zdGF0ZS5wZXJzb24uYWxpdmVTdGF0dXMgPT09IFwiZGVhZFwiID8gJycgOiAnaGlkZGVuICcpICsgXCJwcm9maWxlLWJvZHktcm93XCJ9PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByb2ZpbGUtYm9keS1sZWZ0XCI+XG4gICAgICAgICAgICAgICAgTmfDoHkgbeG6pXRcbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHJvZmlsZS1ib2R5LXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbCBqcy1kZWF0aGRhdGUtaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU9e3RoaXMuc3RhdGUucGVyc29uLmRlYXRoRGF0ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgbmFtZT1cImRlYXRoZGF0ZVwiIHR5cGU9XCJ0ZXh0XCIgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcm9maWxlLWJvZHktcm93XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHJvZmlsZS1ib2R5LWxlZnRcIj5cbiAgICAgICAgICAgICAgICBHaeG7m2kgdMOtbmhcbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHJvZmlsZS1ib2R5LXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAge2dlbmRlcnNWaWV3fVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByb2ZpbGUtYm9keS1yb3dcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcm9maWxlLWJvZHktbGVmdFwiPlxuICAgICAgICAgICAgICAgIMSQaeG7h24gdGhv4bqhaVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcm9maWxlLWJvZHktcmlnaHRcIj5cbiAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgbmFtZT1cInBob25lXCIgdHlwZT1cInRleHRcIiBkZWZhdWx0VmFsdWU9e3RoaXMuc3RhdGUucGVyc29uLnBob25lTm99Lz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcm9maWxlLWJvZHktcm93XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHJvZmlsZS1ib2R5LWxlZnRcIj5cbiAgICAgICAgICAgICAgICDEkOG7i2EgY2jhu4lcbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHJvZmlsZS1ib2R5LXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgPHRleHRhcmVhIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIGNvbHM9XCIzMFwiIGlkPVwiXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXt0aGlzLnN0YXRlLnBlcnNvbi5hZGRyZXNzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lPVwiYWRkcmVzc1wiIHJvd3M9XCIzXCI+PC90ZXh0YXJlYT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhpc3RvcnktY29udGFpbmVyXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoaXN0b3J5LWhlYWRlclwiPlxuICAgICAgICAgICAgVGnhu4N1IHPhu61cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhpc3RvcnktYm9keVwiPlxuICAgICAgICAgICAgPHRleHRhcmVhIG5hbWU9XCJoaXN0b3J5XCIgZGVmYXVsdFZhbHVlPXt0aGlzLnN0YXRlLnBlcnNvbi5zdW1tYXJ5fVxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbCBqcy1oaXN0b3J5LWVkaXRvclwiPjwvdGV4dGFyZWE+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZ2JsKSB7XG4gIC8vIEluaXQgYXBwbGljYXRpb24gZGF0YVxuICBnbG9iYWwgPSBnYmw7XG4gIHN0b3JlcyA9IGdsb2JhbC5zdG9yZXM7XG4gIGNvbmZpZyA9IGdsb2JhbC5jb25maWc7XG4gIHV0aWwgPSBnbG9iYWwudXRpbDtcbiAgUGVyc29uU3RvcmUgPSBzdG9yZXMuUGVyc29uU3RvcmU7XG5cbiAgcmV0dXJuIENvbDJWaWV3O1xufTtcbiIsIi8vIExpYnNcbnZhciBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcblxuLy8gQXBwbGljYXRpb24gRGF0YVxudmFyIGdsb2JhbDtcbnZhciBjb25maWc7XG5cbi8vIFN1YiB2aWV3c1xudmFyIFBhcmVudFZpZXc7XG52YXIgUGFydG5lclZpZXc7XG52YXIgQ2hpbGRWaWV3O1xuXG4vLyBWaWV3IENsYXNzXG52YXIgQ29sM1ZpZXcgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlclBhcmVudFZpZXc6IGZ1bmN0aW9uKCkge1xuICAgIGlmIChjb25maWcuaXNGcm9tUGFyZW50KCkpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxQYXJlbnRWaWV3IC8+XG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcblxuICByZW5kZXJQYXJ0bmVyVmlldzogZnVuY3Rpb24oKSB7XG4gICAgaWYgKGNvbmZpZy5pc0Zyb21QYXJ0bmVyKCkpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxQYXJ0bmVyVmlldyAvPlxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG5cbiAgcmVuZGVyQ2hpbGRWaWV3OiBmdW5jdGlvbigpIHtcbiAgICBpZiAoY29uZmlnLmlzRnJvbUNoaWxkKCkpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxDaGlsZFZpZXcgLz5cbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhcmVudFZpZXcgPSB0aGlzLnJlbmRlclBhcmVudFZpZXcoKTtcbiAgICB2YXIgcGFydG5lclZpZXcgPSB0aGlzLnJlbmRlclBhcnRuZXJWaWV3KCk7XG4gICAgdmFyIGNoaWxkVmlldyA9IHRoaXMucmVuZGVyQ2hpbGRWaWV3KCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJlZGl0cGVyc29uLWNvbC0zXCI+XG4gICAgICAgIHtwYXJlbnRWaWV3fVxuICAgICAgICB7cGFydG5lclZpZXd9XG4gICAgICAgIHtjaGlsZFZpZXd9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihnYmwpIHtcbiAgLy8gSW5pdCBhcHBsaWNhdGlvbiBkYXRhXG4gIGdsb2JhbCA9IGdibDtcbiAgY29uZmlnID0gZ2xvYmFsLmNvbmZpZztcblxuICAvLyBJbml0IHN1YiB2aWV3c1xuICBQYXJlbnRWaWV3ID0gcmVxdWlyZShcIi4vcGFyZW50X3ZpZXcuanN4XCIpKGdibCk7XG4gIFBhcnRuZXJWaWV3ID0gcmVxdWlyZShcIi4vcGFydG5lcl92aWV3LmpzeFwiKShnYmwpO1xuICBDaGlsZFZpZXcgPSByZXF1aXJlKFwiLi9jaGlsZF92aWV3LmpzeFwiKShnYmwpO1xuXG4gIHJldHVybiBDb2wzVmlldztcbn07XG4iLCIvLyBMaWJzXG52YXIgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5cbi8vIEFwcGxpY2F0aW9uIERhdGFcbnZhciBnbG9iYWw7XG52YXIgc3RvcmVzO1xudmFyIGNvbmZpZztcblxuLy8gU3ViIHZpZXdzXG52YXIgQ29sMVZpZXc7XG52YXIgQ29sMlZpZXc7XG52YXIgQ29sM1ZpZXc7XG5cbi8vIE1haW4gVmlldyBjbGFzc1xudmFyIE1haW5WaWV3ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7fTtcbiAgfSxcblxuICByZW5kZXJDb2wxOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPENvbDFWaWV3IC8+XG4gICAgKTtcbiAgfSxcblxuICByZW5kZXJDb2wyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPENvbDJWaWV3IC8+XG4gICAgKTtcbiAgfSxcblxuICByZW5kZXJDb2wzOiBmdW5jdGlvbigpIHtcbiAgICBpZiAoY29uZmlnLmlzRWRpdFBhZ2UoKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxDb2wzVmlldyAvPlxuICAgICAgKTtcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29sMSA9IHRoaXMucmVuZGVyQ29sMSgpO1xuICAgIHZhciBjb2wyID0gdGhpcy5yZW5kZXJDb2wyKCk7XG4gICAgdmFyIGNvbDMgPSB0aGlzLnJlbmRlckNvbDMoKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8Zm9ybSBhY3Rpb249e2NvbmZpZy5nZXRGb3JtQWN0aW9uTGluaygpfSBtZXRob2Q9XCJwb3N0XCIgZW5jVHlwZT1cIm11bHRpcGFydC9mb3JtLWRhdGFcIj5cbiAgICAgICAgICA8aW5wdXQgbmFtZT1cImZyb21QZXJzb25cIiB0eXBlPVwiaGlkZGVuXCIgdmFsdWU9e2NvbmZpZy5nZXRGcm9tUGVyc29uKCl9Lz5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZWRpdHBlcnNvbi1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZWRpdHBlcnNvbi10aXRsZVwiPlxuICAgICAgICAgICAgICBBZGQgbmV3IHBlcnNvblxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImVkaXRwZXJzb24tYnV0dG9uc1wiPlxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tc3VjY2Vzc1wiPlN1Ym1pdDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGFuZ2VyXCI+Q2FuY2VsPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZWRpdHBlcnNvbi1ib2R5XCI+XG4gICAgICAgICAgICB7Y29sMX1cbiAgICAgICAgICAgIHtjb2wyfVxuICAgICAgICAgICAge2NvbDN9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZm9ybT5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGdibCkge1xuICAvLyBJbml0IGFwcGxpY2F0aW9uIGRhdGFcbiAgZ2xvYmFsID0gZ2JsO1xuICBzdG9yZXMgPSBnbG9iYWwuc3RvcmVzO1xuICBjb25maWcgPSBnbG9iYWwuY29uZmlnO1xuXG4gIC8vIEluaXQgU3ViIHZpZXdzXG4gIENvbDFWaWV3ID0gcmVxdWlyZShcIi4vY29sXzFfdmlldy5qc3hcIikoZ2JsKTtcbiAgQ29sMlZpZXcgPSByZXF1aXJlKFwiLi9jb2xfMl92aWV3LmpzeFwiKShnYmwpO1xuICBDb2wzVmlldyA9IHJlcXVpcmUoXCIuL2NvbF8zX3ZpZXcuanN4XCIpKGdibCk7XG5cbiAgcmV0dXJuIE1haW5WaWV3O1xufTtcbiIsIi8vIExpYnNcbnZhciBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcblxuLy8gQXBwbGljYXRpb24gRGF0YVxudmFyIGdsb2JhbDtcbnZhciBjb25maWc7XG52YXIgUGFyZW50U3RvcmU7XG52YXIgUGFyZW50QWN0aW9uO1xuXG4vLyBWaWV3IGNsYXNzXG52YXIgUGFyZW50VmlldyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZmF0aGVyOiBQYXJlbnRTdG9yZS5nZXRGYXRoZXIoKSxcbiAgICAgIG1vdGhlcjogUGFyZW50U3RvcmUuZ2V0TW90aGVyKClcbiAgICB9O1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICBQYXJlbnRTdG9yZS5iaW5kKFwiY2hhbmdlXCIsIHRoaXMucGFyZW50Q2hhbmdlZCk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIFBhcmVudFN0b3JlLnVuYmluZChcImNoYW5nZVwiLCB0aGlzLnBhcmVudENoYW5nZWQpO1xuICB9LFxuXG4gIHBhcmVudENoYW5nZWQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXJlbnQgPSB7XG4gICAgICBmYXRoZXI6IFBhcmVudFN0b3JlLmdldEZhdGhlcigpLFxuICAgICAgbW90aGVyOiBQYXJlbnRTdG9yZS5nZXRNb3RoZXIoKVxuICAgIH07XG4gICAgdGhpcy5zZXRTdGF0ZShwYXJlbnQpO1xuICB9LFxuXG4gIGhhbmRsZVJlbW92ZUZhdGhlcjogZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBQYXJlbnRBY3Rpb24ucmVtb3ZlRmF0aGVyKCk7XG4gIH0sXG5cbiAgaGFuZGxlUmVtb3ZlTW90aGVyOiBmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIFBhcmVudEFjdGlvbi5yZW1vdmVNb3RoZXIoKTtcbiAgfSxcblxuICBoYW5kbGVTZWxlY3RNb3RoZXI6IGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgUGFyZW50QWN0aW9uLnNlbGVjdE1vdGhlcigpO1xuICB9LFxuXG4gIGhhbmRsZVNlbGVjdEZhdGhlcjogZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBQYXJlbnRBY3Rpb24uc2VsZWN0RmF0aGVyKCk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYXJlbnQtdGl0bGVcIj5cbiAgICAgICAgICBQYXJlbnRzXG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhcmVudC1oZWxwXCI+XG4gICAgICAgICAgTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2ljaW5nIGVsaXQsIHNlZCBkbyBlaXVzbW9kIHRlbXBvciBpbmNpZGlkdW50LlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYXJlbnQtYm9keVwiPlxuICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJmYXRoZXJJZFwiIHR5cGU9XCJoaWRkZW5cIiB2YWx1ZT17dGhpcy5zdGF0ZS5mYXRoZXIuaWR9Lz5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYXJlbnQtaW1hZ2UgcGVvcGxlLWltYWdlXCI+XG4gICAgICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJpbWctcmVzcG9uc2l2ZSBpbWctcm91bmRlZFwiIGFsdD1cIlwiIHNyYz17dGhpcy5zdGF0ZS5mYXRoZXIucGljdHVyZX0vPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYXJlbnQtaW5mbyBwZW9wbGUtaW5mb1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFyZW50LW5hbWUgcGVvcGxlLW5hbWVcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuPkZhdGhlcjogPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPHNwYW4+e3RoaXMuc3RhdGUuZmF0aGVyLmZ1bGxOYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17IWNvbmZpZy5pc0Zyb21GYXRoZXIoKSA/IFwiXCIgOiBcImhpZGRlblwifT5cbiAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgb25DbGljaz17dGhpcy5oYW5kbGVTZWxlY3RGYXRoZXJ9PlNlbGVjdDwvYT4mbmJzcDtcbiAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgb25DbGljaz17dGhpcy5oYW5kbGVSZW1vdmVGYXRoZXJ9PlJlbW92ZTwvYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cIm1vdGhlcklkXCIgdHlwZT1cImhpZGRlblwiIHZhbHVlPXt0aGlzLnN0YXRlLm1vdGhlci5pZH0vPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhcmVudC1pbWFnZSBwZW9wbGUtaW1hZ2VcIj5cbiAgICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImltZy1yZXNwb25zaXZlIGltZy1yb3VuZGVkXCIgYWx0PVwiXCIgc3JjPXt0aGlzLnN0YXRlLm1vdGhlci5waWN0dXJlfS8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhcmVudC1pbmZvIHBlb3BsZS1pbmZvXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYXJlbnQtbmFtZSBwZW9wbGUtbmFtZVwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4+TW90aGVyOiA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8c3Bhbj57dGhpcy5zdGF0ZS5tb3RoZXIuZnVsbE5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXshY29uZmlnLmlzRnJvbU1vdGhlcigpID8gXCJcIiA6IFwiaGlkZGVuXCJ9PlxuICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBvbkNsaWNrPXt0aGlzLmhhbmRsZVNlbGVjdE1vdGhlcn0+U2VsZWN0PC9hPiZuYnNwO1xuICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBvbkNsaWNrPXt0aGlzLmhhbmRsZVJlbW92ZU1vdGhlcn0+UmVtb3ZlPC9hPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihnYmwpIHtcbiAgLy8gSW5pdCBhcHBsaWNhdGlvbiBkYXRhXG4gIGdsb2JhbCA9IGdibDtcbiAgY29uZmlnID0gZ2xvYmFsLmNvbmZpZztcbiAgUGFyZW50U3RvcmUgPSBnbG9iYWwuc3RvcmVzLlBhcmVudFN0b3JlO1xuICBQYXJlbnRBY3Rpb24gPSBnbG9iYWwuYWN0aW9ucy5QYXJlbnRBY3Rpb247XG5cbiAgcmV0dXJuIFBhcmVudFZpZXc7XG59O1xuIiwiLy8gTGlic1xudmFyIFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xuXG4vLyBBcHBsaWNhdGlvbiBEYXRhXG52YXIgZ2xvYmFsO1xudmFyIGNvbmZpZztcbnZhciBQYXJ0bmVyU3RvcmU7XG5cbi8vIFZpZXcgY2xhc3NcbnZhciBQYXJ0bmVyVmlldyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcGFydG5lcjogUGFydG5lclN0b3JlLmdldFBhcnRuZXIoKVxuICAgIH07XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmYW1pbHktdGl0bGVcIj5cbiAgICAgICAgICBGYW1pbHlcbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmFtaWx5LWhlbHBcIj5cbiAgICAgICAgICBMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdFxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmYW1pbHktYm9keVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmFtaWx5LWxpc3RcIj5cbiAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJwYXJ0bmVyLWxpc3RcIj5cbiAgICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwicGFydG5lcklkXCIgdHlwZT1cImhpZGRlblwiIHZhbHVlPXt0aGlzLnN0YXRlLnBhcnRuZXIuaWR9Lz5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhcnRuZXItaW1hZ2UgcGVvcGxlLWltYWdlXCI+XG4gICAgICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImltZy1yZXNwb25zaXZlIGltZy1yb3VuZGVkXCIgYWx0PVwiXCIgc3JjPXt0aGlzLnN0YXRlLnBhcnRuZXIucGljdHVyZX0vPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFydG5lci1pbmZvIHBlb3BsZS1pbmZvXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhcnRuZXItbmFtZSBwZW9wbGUtbmFtZVwiPlxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5zdGF0ZS5wYXJ0bmVyLmZ1bGxOYW1lfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGdibCkge1xuICAvLyBJbml0IGFwcGxpY2F0aW9uIGRhdGFcbiAgZ2xvYmFsID0gZ2JsO1xuICBjb25maWcgPSBnbG9iYWwuY29uZmlnO1xuICBQYXJ0bmVyU3RvcmUgPSBnbG9iYWwuc3RvcmVzLlBhcnRuZXJTdG9yZTtcblxuICByZXR1cm4gUGFydG5lclZpZXc7XG59O1xuIl19
