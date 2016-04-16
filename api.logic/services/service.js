'use strict';

const request = require('request');
const uuid = require('node-uuid');
const _ = require('lodash');

module.exports = class Service{
  constructor(host, port) {
    this.host = host;
    this.port = port;
  }

  buildUri(url) {
    return `http://${this.host}:${this.port}${url}`;
  }

  buildHeaders(context) {
    return {
      'correlationId': _.get(context, ['request', 'header', 'correlationId'], uuid.v4())
    };
  }

  sendRequest(opts) {
    return new Promise(function(resolve){
      request(opts, function(error, response, body){
        resolve({error, response, body});
      });
    });
  }

  * send(method, url, data, context) {
    // build data
    const opts = {
      uri: this.buildUri(url),
      headers: this.buildHeaders(context),
      json: data || {},
      method
    };

    // send request
    const result = yield this.sendRequest(opts);

    if(result.error) {
      throw result.error;
    }

    const statusCode = result.response.statusCode;
    if(_.parseInt(statusCode) < 200 || _.parseInt(statusCode) > 400) {
      throw result.response;
    }

    if(!result.body.success) {
      throw result.body;
    }

    return _.pick(result.body, ['message', 'data']);
  }
};
