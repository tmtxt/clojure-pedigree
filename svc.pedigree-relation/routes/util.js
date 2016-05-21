'use strict';

const _ = require('lodash');

function* requirePersonNodeIdMdw(next) {
  const logTrace = this.logTrace;
  const body = this.request.body;
  const personNodeId = body.personNodeId;

  if (_.isNil(personNodeId)) {
    let message = 'personNodeId is required';
    logTrace.add('error', 'Validate personNodeId', message);
    this.body = {
      success: false,
      message
    };
    return;
  }

  yield next;
}

exports.requirePersonNodeIdMdw = requirePersonNodeIdMdw;
