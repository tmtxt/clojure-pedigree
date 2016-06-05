'use strict';

const React = require('react');

const components = require('Components');
const Header = components.Header;

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <Header />
      </div>
    );
  }
});
