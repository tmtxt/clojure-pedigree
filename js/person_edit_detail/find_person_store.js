var global = require('./global.js');

function getPersonList() {
  return this.personList;
}

function isEnable() {
  return this.enable;
}

var store = {
  personList: [],
  enable: false,

  getPersonList: getPersonList,
  isEnable: isEnable
};
exports.store = store;

function init(personList) {
  if(!!personList) {
    store.personList = personList;
    store.enable = true;
  } else {
    store.personList = [];
    store.enable = false;
  }
}
exports.init = init;
