'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

const MainLayout = require('MainLayout');
const MainView = require('./view.jsx');

ReactDOM.render(
  <MainLayout>
    <MainView />
  </MainLayout>,
  document.getElementById('pd-site-content')
);
