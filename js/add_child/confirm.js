// Libs
var jquery = require('jquery');
var q = require('q');

// Components
var confirmModal = jquery('.js-confirm-modal');
var confirmButton = jquery('.js-confirm-continue');

// Unregister events
function unregisterEvents() {
  confirmModal.unbind();
  confirmButton.unbind();
}

// Prompt for user to confirm
// Returns a promise
// resolve when confirm
// reject when cancel
function confirm() {
  return q.Promise(function(resolve, reject){
    unregisterEvents();

    confirmModal.on('hidden.bs.modal', function(){
      reject();
    });

    confirmButton.click(function(){
      unregisterEvents();
      confirmModal.modal('hide');
      resolve();
    });

    confirmModal.modal('show');
  });
}
exports.confirm = confirm;
