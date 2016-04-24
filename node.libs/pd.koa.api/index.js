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
    var multer = require('koa-multer');
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
    app.use(multer({limits: '10mb'}));
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
        svcName: serviceName
      };
      var logTrace = new LogTrace(props);

      // assign log trace object to context
      ctx.logTrace = logTrace;

      // wrap next handler to handle uncaught exception
      try {
        yield next;
      } catch (err) {
        let status = this.response.status;
        let request = _.pick(this.request, ['method', 'url', 'header', 'body']);
        let response = _.pick(this.response, ['message', 'header', 'body']);
        logTrace.add('error', 'Error in processing request', err);
        logTrace.write({status, request, response});
        throw err;
      }

      let status = this.response.status;
      let request = _.pick(this.request, ['method', 'url', 'header', 'body']);
      let response = _.pick(this.response, ['message', 'header', 'body']);

      if (status > 300) {
        logTrace.add('error', 'Error in processing request', {status});
      }

      logTrace.write({status, request, response, serviceName});
    };
  }
};
