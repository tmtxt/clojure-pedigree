var React = require("react");

// Global Flux
var global = require("./global.js");
var ChildStore = global.stores.child;

var ChildView = React.createClass({
  getInitialState: function() {
    return {
      child: ChildStore.getChild()
    };
  },

  render: function() {
    if(!global.addFromChild()) {
      return (
        <div>
        </div>
      );
    }

    return (
      <div className="family-container">
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
module.exports = ChildView;
