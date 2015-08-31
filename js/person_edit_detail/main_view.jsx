// Libs
var React = require("react");

// Views components
var HeaderView = require("./header_view.jsx");
var Col1View = require("./col_1_view.jsx");
var Col2View = require("./col_2_view.jsx");

// Main View class
var MainView = React.createClass({
  render: function() {
    return (
      <div>
        <HeaderView />

        <div className="editperson-body">
          <Col1View />

          <Col2View />
        </div>
      </div>
    );
  }
});
module.exports = MainView;
