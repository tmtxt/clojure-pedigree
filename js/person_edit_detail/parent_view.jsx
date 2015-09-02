var React = require("react");

// Global Flux
var global = require("./global.js");
var ParentStore = global.stores.parent;
var ParentAction = global.actions.parent;

var ParentView = React.createClass({
  getInitialState: function() {
    return {
      father: ParentStore.getFather(),
      mother: ParentStore.getMother()
    };
  },

  handleRemoveFather: function(e) {
    e.preventDefault();
    ParentAction.removeFather();
  },

  render: function() {
    return (
      <div className="parent-container">
        <div className="parent-title">
          Parents
        </div>
        <div className="parent-help">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.
        </div>
        <div className="parent-body">
          <ul>
            <li>
              <div className="parent-image people-image">
                <img className="img-responsive img-rounded" alt="" src={this.state.father.picture}/>
              </div>
              <div className="parent-info people-info">
                <div className="parent-name people-name">
                  <span>Father: </span>
                  <span>{this.state.father.fullName}</span>
                </div>
                <div>
                  <a href="">Select</a>
                  <a onClick={this.handleRemoveFather}>Remove</a>
                </div>
              </div>
            </li>
            <li>
              <div className="parent-image people-image">
                <img className="img-responsive img-rounded" alt="" src={this.state.mother.picture}/>
              </div>
              <div className="parent-info people-info">
                <div className="parent-name people-name">
                  <span>Mother: </span>
                  <span>{this.state.mother.fullName}</span>
                </div>
                <div>
                  <a href="">Select</a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
});
module.exports = ParentView;
