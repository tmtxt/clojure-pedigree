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
    this.actionLink = "/person/edit/process";
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
