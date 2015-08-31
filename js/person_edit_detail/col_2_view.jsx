// Libs
var React = require("react");

// Sub views
var ProfileView = require("./profile_view.jsx");

// Main view
var Col2View = React.createClass({
  render: function() {

    return (
      <div className="editperson-col-2">
        <ProfileView statuses={this.props.statuses}
                     genders={this.props.genders} />

        <div className="history-container">
          <div className="history-header">
            History
          </div>
          <div className="history-body">
            <textarea className="form-control" cols="30" id="" name="" rows="10"></textarea>
          </div>
        </div>
      </div>
    );
  }
});
module.exports = Col2View;
