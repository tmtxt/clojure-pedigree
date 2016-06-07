'use strict';

const React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div className="editperson-col-1">
        <div className="col-1-img">
          <img className="img-responsive img-thumbnail" alt="" src={this.props.person.picture}/>
          <input name="picture"
                 type="file" accept="image/*" className="hidden js-picture-input"/>
        </div>
        <div className="col-1-buttons">
          <button
              className="btn btn-success">Select</button>
          <button className="btn btn-danger">Delete</button>
        </div>
      </div>
    );
  }
});
