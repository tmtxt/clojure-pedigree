'use strict';

const React = require('react');

const Col1View = require('./col1_view.jsx');
const Col2View = require('./col2_view.jsx');


module.exports = React.createClass({
  render: function() {
    return (
      <div className="page-editperson">
        <form method="post" encType="multipart/form-data">
          <input name="fromPerson" type="hidden" value=""/>

          <div className="editperson-header">
            <div className="editperson-title">
              Add new person
            </div>
            <div className="editperson-buttons">
              <button className="btn btn-success">Submit</button>
              <button className="btn btn-danger">Cancel</button>
            </div>
          </div>

          <div className="editperson-body">
            <Col1View person={this.props.person} />
            <Col2View person={this.props.person} />
          </div>
        </form>
      </div>
    );
  }
});
