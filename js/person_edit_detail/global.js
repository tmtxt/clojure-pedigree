// some data
var fromPerson = window.fromPerson || null;

var config = {
  fromPerson: fromPerson,

  isFromParent: function() {
    return this.fromPerson === "parent";
  },

  isFromPartner: function() {
    return this.fromPerson === "partner";
  }
};

// global object
var page = {
  dispatcher: null,
  stores: {
    parent: null
  },
  actions: {
    parent: null
  },
  config: config
};
module.exports = page;
