'use strict';

var _ = require('lodash');
var uuid = require('node-uuid');

const logger = require('./logger');

module.exports = class LogTrace {
  /**
   * Constructor
   *
   * @param  {object} props Properties
   */
  constructor(props) {
    this.logTraces = [];
    this.startedAt = Date.now();
    this.props = props || {};
  }

  /**
   * Add a log entry
   *
   * @param {string} logLevel  Log level
   * @param {string} logTitle   Log title
   * @param {string} message   Log message
   * @return {timestamp}
   */
  add(logLevel, logTitle, message) {
    if (_.isObject(message)) {
      message = JSON.stringify(message, null, 2);
    }

    this.logTraces.push({
      logLevel,
      logTitle,
      message
    });
  }

  /**
   * Write log
   */
  write() {
    let logTraces = this.logTraces;

    const logLevel = this.tryGetLevel('error') || this.tryGetLevel('warn') || 'info';

    let strings = logTraces.map((logTrace, idx) => {
      return `[${idx + 1}] ${logTrace.logLevel.toUpperCase()} ${logTrace.logType} : ${logTrace.message}`;
    });

    _.assign(this.props, {
      processTime: `${Date.now() - this.startedAt} ms`
    });

    return logger[logLevel](strings.join('\n'), this.props);
  }

  /**
   * Try get the log level
   */
  tryGetLevel(level) {
    return _.find(this.logTraces, {
      logLevel: level
    }) && level || null;
  }
};
