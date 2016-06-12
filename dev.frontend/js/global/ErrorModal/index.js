'use strict';

const ReactDOM = require('react-dom');
const React = require('react');
const $ = require('jquery');
const ErrorView = require('./modal.jsx');


function createContainer() {
  var id = parseInt(Math.random() * 1000);
  id = `js-error-modal-${id}`;
  var div = document.createElement('div');
  div = $(div);
  div.attr('id', id);
  div.addClass(id);
  div.appendTo('body');

  return id;
}

exports.showErrorModal = function(opts) {
  opts = opts || {};

  // create the container div for the modal
  const containerId = createContainer();
  console.log(containerId);

  // create the container
  ReactDOM.render(
    React.createElement(ErrorView, {opts}),
    document.getElementById(containerId)
  );

  // show the modal
  $(`#${containerId} div.modal`).modal();
};
