var React = require('react');
var MainView = require('./main_view.jsx');

React.render(
  React.createElement(MainView,
                      {}),
  document.getElementById('js-editperson-container')
);
