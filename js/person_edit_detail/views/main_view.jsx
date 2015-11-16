// Libs
var React = require("react");

// Application Data
var global;
var stores;
var config;

// Sub views
var Col1View;
var Col2View;
var Col3View;

// Main View class
var MainView = React.createClass({
  getInitialState: function() {
    return {};
  },

  renderCol1: function() {
    return (
      <Col1View />
    );
  },

  render: function() {
    var col1 = this.renderCol1();

    return (
      <div>
        <form action={config.getFormActionLink()} method="post" encType="multipart/form-data">
          <input name="fromPerson" type="hidden" value={config.getFromPerson()}/>

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
            {col1}
          </div>
        </form>
      </div>
    );
  }
});

module.exports = function(gbl) {
  // Init application data
  global = gbl;
  stores = global.stores;
  config = global.config;

  // Init Sub views
  Col1View = require("./col_1_view.jsx")(gbl);

  return MainView;
};
