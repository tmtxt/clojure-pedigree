// Libs
var React = require("react");

// Sub views
var ProfileView = require("./profile_view.jsx");
var HistoryView = require("./history_view.jsx");

// Main view
var Col2View = React.createClass({
  render: function() {

    return (
      <div className="editperson-col-2">
        <ProfileView statuses={this.props.statuses}
                     genders={this.props.genders} />

        <HistoryView />
      </div>
    );
  }
});
module.exports = Col2View;
