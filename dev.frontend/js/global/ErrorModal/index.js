'use strict';

const ReactDOM = require('react-dom');
const React = require('react');
const $ = require('jquery');
const ErrorView = require('./modal.jsx');


/**
 * Create the container div for the error modal
 * @returns {string} the id/class name of the container div
 */
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


/**
 * Handle redirect when modal dismiss
 * @param {object} modal
 * @param {string} url
 */
function handleEventRedirect(modal, url) {
  modal.on('hidden.bs.modal', () => {
    window.location = url;
  });
  setTimeout(function(){window.location = url;}, 5000);
}


/**
 * Remove the modal and container when modal dismissed
 * @param {object} modal
 */
function handleEventClear(modal) {

}


/**
 * Show the error modal
 * @param {object} opts
 * {
 * title: '',
 * message: '',
 * redirect: ''
 * }
 */
exports.showErrorModal = function(opts) {
  opts = opts || {};

  // create the container div for the modal
  const containerId = createContainer();

  // create the container
  ReactDOM.render(
    React.createElement(ErrorView, {opts}),
    document.getElementById(containerId)
  );
  const modal = $(`#${containerId} div.modal`);

  // events
  if (opts.redirect) {
    handleEventRedirect(modal, opts.redirect);
  } else {
    handleEventClear(modal);
  }

  // show the modal
  modal.modal();
};
