'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

const MainLayout = require('MainLayout');

ReactDOM.render(
  React.createElement(MainLayout, null),
  document.getElementById('pd-site-content')
);
