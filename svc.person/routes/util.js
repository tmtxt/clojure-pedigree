'use strict';

// Require id middle ware
exports.requireIdMdw = function*(next) {
  var personId = this.request.body.personId;
  var logTrace = this.logTrace;

  if (!personId) {
    let message = 'Person id is required';
    logTrace.add('error', 'Person id validation', message);
    this.body = {
      success: false,
      message
    };
    return;
  }

  yield next;
};
