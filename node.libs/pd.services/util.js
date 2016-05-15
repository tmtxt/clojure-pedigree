'use strict';

const request = require('request');
var uuid = require('node-uuid');

const config = require('./config');


/**
 * Make header
 * @param {object} logTrace
 * @return {object}
 */
function makeHeader(logTrace) {
  let correlationId;

  if (logTrace) {
    correlationId = logTrace.correlationId || uuid.v4();
  } else {
    // TODO: auto create a new logTrace instance here
    correlationId = uuid.v4();
  }

  return {
    correlationId
  };
}


/**
 * Make the url
 * @param {string} serviceName
 * @param {string} uri
 * @returns {string}
 */
function makeUrl(serviceName, uri) {
  const service = config[serviceName];
  const host = service.host;
  const port = service.port;

  return `http://${host}:${port}${uri}`;
}


/**
 * Send http request to other service
 * TODO logTrace
 * @param {string} serviceName
 * @param {string} uri
 * @param {string} method
 * @param {string} body
 * @param {LogTrace} logTrace
 * @return {Promise}
 */
function send(serviceName, uri, method, body, logTrace) {
  const headers = makeHeader(logTrace);
  const url = makeUrl(serviceName, uri);
  method = method.toUpperCase();

  const options = {
    url,
    headers,
    method,
    body,
    json: true
  };

  const promise = new Promise(function(resolve, reject){
    logTrace.add('info', 'pd.services.send()', `Start sending request to service ${serviceName}`);
    request(options, function(err, res, body){
      if (err) {
        logTrace.add('error', `Error in calling to service ${serviceName}`, err);
        reject(err);
        return;
      }

      const success = body.success;
      if (!success) {
        logTrace.add('error', `Error in calling to service ${serviceName}`);
        reject(body);
      }

      logTrace.add('info', `Finished calling to service ${serviceName}`);
      resolve(body.data);
    });
  });

  return promise;
}

module.exports = {
  send
};
