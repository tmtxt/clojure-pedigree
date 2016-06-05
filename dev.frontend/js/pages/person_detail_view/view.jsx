'use strict';

const React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        {this.props.params.personId}
      </div>
    );
  }
});
