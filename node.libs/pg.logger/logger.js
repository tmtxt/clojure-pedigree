'use strict';

const winston = require('winston');

exports.createLoggerForService = function(opts) {
  var fileName = opts.fileName || 'default.log';

  return new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        level: 'info',
        json: true,
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
    ]
  });
};
