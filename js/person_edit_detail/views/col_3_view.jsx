// Libs
var React = require("react");

// Application Data
var global;
var config;

// View Class
var Col3View = React.createClass({
  render: function() {
    return (
      <div className="editperson-col-3">
        Hello
      </div>
    );
  }
});

module.exports = function(gbl) {
  // Init application data
  global = gbl;
  config = global.config;

  return Col3View;
};
