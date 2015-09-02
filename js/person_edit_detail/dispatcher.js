var event = require('microevent');
var flux = require("flux");
var jquery = require("jquery");

//
var Dispatcher = new flux.Dispatcher();
exports.dispatcher = Dispatcher;

//
function init() {
  var global = require('./global.js');
  var ParentStore = global.stores.parent;
  var FindPersonStore = global.stores.findPerson;
  event.mixin(ParentStore);

  Dispatcher.register(function(payload){
    switch(payload.eventName) {
    case 'remove-father':
      ParentStore.removeFather();
      ParentStore.trigger('change');
      break;
    case 'remove-mother':
      ParentStore.removeMother();
      ParentStore.trigger('change');
      break;
    case 'select-mother':
      require('./find_person_process.js').select();
    }
  });
}
exports.init = init;
