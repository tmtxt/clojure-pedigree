var React = require("react");

var HeaderView = React.createClass({
  render: function() {
    return (
      <div className="editperson-header">
        <div className="editperson-title">
          Add new person
        </div>
        <div className="editperson-buttons">
          <button className="btn btn-success">Submit</button>
          <button className="btn btn-danger">Cancel</button>
        </div>
      </div>
    );
  }
});
module.exports = HeaderView;
