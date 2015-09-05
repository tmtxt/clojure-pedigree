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

  componentDidMount: function() {
    ParentStore.bindChanged(this.parentChanged);
  },

  componentWillUnmount: function() {
    ParentStore.unbindChanged(this.parentChanged);
  },

  parentChanged: function() {
    var parent = {
      father: ParentStore.getFather(),
      mother: ParentStore.getMother()
    };
    this.setState(parent);
  },

  handleRemoveFather: function(e) {
    e.preventDefault();
    ParentAction.removeFather();
  },

  handleRemoveMother: function(e) {
    e.preventDefault();
    ParentAction.removeMother();
  },

  handleSelectMother: function(e) {
    e.preventDefault();
    ParentAction.selectMother();
  },

  handleSelectFather: function(e) {
    e.preventDefault();
    ParentAction.selectFather();
  },

  render: function() {
    var rootClassName = "parent-container";
    if (!(global.addFromParent() || global.addFromNone())) {
      rootClassName += " hidden";
    }

    return (
      <div className={rootClassName}>
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
                <div className={ParentStore.canChangeFather() ? "" : "hidden"}>
                  <a href="#" onClick={this.handleSelectFather}>Select</a>&nbsp;
                  <a href="#" onClick={this.handleRemoveFather}>Remove</a>
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
                <div className={ParentStore.canChangeMother() ? "" : "hidden"}>
                  <a href="#" onClick={this.handleSelectMother}>Select</a>&nbsp;
                  <a href="#" onClick={this.handleRemoveMother}>Remove</a>
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
