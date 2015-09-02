var event = require('microevent');
var flux = require("flux");

//
var Dispatcher = new flux.Dispatcher();
exports.dispatcher = Dispatcher;

//
function init() {
  var global = require('./global.js');
  var ParentStore = global.stores.parent;
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
    }
  });
}
exports.init = init;
