'use strict';

const winston = require('winston');

exports.createLoggerForService = function(opts) {
  var fileName = opts.fileName || 'default.log';

  const transports = [];

  if (process.env.LOG_CONSOLE == 'true') {
    transports.push(
      new (winston.transports.Console)({
        level: 'info',
        json: false,
        stringify: false,
        timestamp: true,
        colorize: true,
        prettyPrint: true
      })
    );
  }

  if (process.env.LOG_FILE == 'true') {
    transports.push(
      new (winston.transports.File)({
        level: 'info',
        json: true,
        stringify: true,
        timestamp: true,
        filename: `/logs/${fileName}.log`
      })
    );
  }

  return new (winston.Logger)({
    transports
  });
};

exports.createLoggerForException = function(opts) {
  var fileName = opts.fileName || 'default.log';

  return winston.handleExceptions([
    new (winston.transports.Console)({
      level: 'error',
      // json: true,
      stringify: true,
      timestamp: true,
      colorize: true
    }),
    new (winston.transports.File)({
      level: 'info',
      json: true,
      stringify: true,
      timestamp: true,
      filename: `/logs/${fileName}.log`
    })
  ]);
};
