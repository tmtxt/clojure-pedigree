'use strict';

const React = require('react');

const ParentView = require('./parent_view.jsx');


module.exports = React.createClass({
  render: function() {
    const tree = this.props.tree;
    const fromRole = tree.get('fromRole');
    const initializing = tree.get('initializing');

    return (
      <div className="editperson-col-3">
        { /* Parent view */ }
        {fromRole == 'parent' ?
         initializing ?
         <i className="fa fa-spinner fa-spin fa-4x fa-fw"></i> :
         <ParentView tree={this.props.tree} />
         : ""}
      </div>
    );
  }
});
