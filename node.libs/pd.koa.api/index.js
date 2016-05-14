'use strict';

var LogTrace = require('pd.logger').LogTrace;
var logger = require('pd.logger').logger;
var uuid = require('node-uuid');
var _ = require('lodash');

module.exports = class KoaApi {
  constructor(opts) {
    opts = opts || {};

    this.port = opts.port || 80;
    this.routes = opts.routes;
    this.context = opts.context || {};
    this.svcName = opts.svcName;
    this.serviceName = opts.svcName;

    this.createKoaApiApp();
  }

  createKoaApiApp() {
    var app = require('koa')();
    var parser = require('koa-bodyparser');
    var json = require('koa-json');
    var extraCtx = this.context;
    var serviceName = this.serviceName;
    var port = this.port;
    var routes = this.routes;
    var logMiddleware = this.createLogMiddleware();
    var log = logger.createLoggerForService({fileName: serviceName});
    logger.createLoggerForException({fileName: serviceName});

    this.app = app;

    // global middleware
    app.use(parser());
    app.use(json());
    app.use(logMiddleware);

    // extra context
    _.assign(app.context, extraCtx);

    // routes
    app.use(routes);

    // start app
    app.listen(port);
    log.info(`Server listening on port ${port}`, {serviceName});
  }

  createLogMiddleware() {
    var serviceName = this.serviceName;

    return function* (next) {
      // create log trace object
      var ctx = this;
      var correlationId = _.get(ctx, ['request', 'header', 'correlationId']) || uuid.v4();
      var props = {
        correlationId,
        serviceName
      };
      var logTrace = new LogTrace(props);

      // assign log trace object to context
      ctx.logTrace = logTrace;

      // wrap next handler to handle uncaught exception
      const requestData = processRequestLogData(this.request);
      try {
        yield next;
      } catch (err) {
        let status = this.response.status;
        let responseData = processResponseLogData(this.response);
        logTrace.add('error', 'Error in processing request', err);
        logTrace.write({status, request: requestData, response: responseData});
        throw err;
      }

      let status = this.response.status;
      let responseData = processResponseLogData(this.response);

      if (status > 300) {
        logTrace.add('error', 'Error in processing request', {status});
      }

      logTrace.write({
        httpData: {
          status, request: requestData, response: responseData
        }
      });
    };
  }
};


/**
 * Transform the request data to the right log data schema
 * @param {object} request
 * @returns {object}
 */
function processRequestLogData(request) {
  var data = {
    header: _.pick(request.header, ['content-type', 'host', 'params']),
    params: request.params,
    body:   JSON.stringify(request.body),
    url:    request.url,
    method: request.method
  };

  return data;
}


/**
 * Transform the response data to the right log data schema
 * @param {object} response
 * @returns {object}
 */
function processResponseLogData(response) {
  var data = {
    header:  response.header,
    message: response.message,
    body:    null
  };

  if (_.isObject(data.body)) {
    data.body = JSON.stringify(data.body);
  }

  return data;
}
