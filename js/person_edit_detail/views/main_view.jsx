// Libs
var React = require("react");
var global;
var stores;
var config;

// Main View class
var MainView = React.createClass({
  getInitialState: function() {
    return {};
  },

  render: function() {
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
          </div>
        </form>
      </div>
    );
  }
});

module.exports = function(gbl) {
  global = gbl;
  stores = global.stores;
  config = global.config;

  return MainView;
};
