var LogTrace = require('./log_trace.js');
var _ = require('lodash');
const uuid = require('node-uuid');

module.exports = function(opts) {
  return function* (next) {
    // log trace object
    var logTrace = createLogTrace(this, opts);
    this.logTrace = logTrace;

    // wrap next handler to handle uncaught exception
    try {
      yield next;
    } catch (err) {
      logTrace.add('error', 'Error in processing request', err);
      logTrace.write();
      throw err;
    }
    logTrace.write();
  };
};

function createLogTrace(ctx, opts) {
  var props = {};
  props.correlationId = _.get(ctx, ['request', 'params', 'correlationId']) || uuid.v4();
  props.serviceName = opts.svcName;

  var logTrace = new LogTrace(props);

  return logTrace;
}
