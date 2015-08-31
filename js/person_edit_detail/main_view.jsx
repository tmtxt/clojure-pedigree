// Libs
var React = require("react");

// Views components
var HeaderView = require("./header_view.jsx");

// Main View class
var MainView = React.createClass({
  render: function() {
    return (
      <div>
        <HeaderView />
      </div>
    );
  }
});
module.exports = MainView;
