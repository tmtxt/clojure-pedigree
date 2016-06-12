'use strict';

const $ = require('jquery');
const uuid = require('node-uuid');

exports.getData = async function(url, data) {
  const result = await $.get({
    url, data,
    headers: {
      'correlation-id': uuid.v4()
    }
  });

  if (!result.success) {
    throw new Error(result.message);
  }

  return result.data;
};

function waitFor() {
  return new Promise(function(resolve){
    setTimeout(function(){resolve();}, 2000);
  });
}

exports.redirect = function(url) {
  window.location = url;
};
