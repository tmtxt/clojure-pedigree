// Libs
var React = require("react");

// Application Data
var global;
var config;
var ChildStore;

// View class
var ChildView = React.createClass({
  getInitialState: function() {
    return {
      child: ChildStore.getChild()
    };
  },

  render: function() {
    return (
      <div className="family-container">
        <input name="childId" type="hidden" value={this.state.child.id}/>
        <div className="family-title">
          Child
        </div>
        <div className="family-help">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit
        </div>
        <div className="family-body">
          <div className="family-list">
            <ul className="partner-list">
              <li>
                <div className="partner-image people-image">
                  <img className="img-responsive img-rounded" alt="" src={this.state.child.picture}/>
                </div>
                <div className="partner-info people-info">
                  <div className="partner-name people-name">
                    {this.state.child.fullName}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = function(gbl) {
  // Init application data
  global = gbl;
  config = global.config;
  ChildStore = global.stores.ChildStore;

  return ChildView;
};
