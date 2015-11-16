// Libs
var React = require("react");

// Application Data
var global;
var config;
var ParentStore;

// View class
var ParentView = React.createClass({
  getInitialState: function() {
    return {
      father: ParentStore.getFather(),
      mother: ParentStore.getMother()
    };
  },

  componentDidMount: function() {
    ParentStore.bind("change", this.parentChanged);
  },

  componentWillUnmount: function() {
    ParentStore.unbind("change", this.parentChanged);
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
    return (
      <div>
        <div className="parent-title">
          Parents
        </div>
        <div className="parent-help">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.
        </div>
        <div className="parent-body">
          <ul>
            <li>
              <input name="fatherId" type="hidden" value={this.state.father.id}/>
              <div className="parent-image people-image">
                <img className="img-responsive img-rounded" alt="" src={this.state.father.picture}/>
              </div>
              <div className="parent-info people-info">
                <div className="parent-name people-name">
                  <span>Father: </span>
                  <span>{this.state.father.fullName}</span>
                </div>
                <div className={!config.isFromFather() ? "" : "hidden"}>
                  <a href="#" onClick={this.handleSelectFather}>Select</a>&nbsp;
                  <a href="#" onClick={this.handleRemoveFather}>Remove</a>
                </div>
              </div>
            </li>
            <li>
              <input name="motherId" type="hidden" value={this.state.mother.id}/>
              <div className="parent-image people-image">
                <img className="img-responsive img-rounded" alt="" src={this.state.mother.picture}/>
              </div>
              <div className="parent-info people-info">
                <div className="parent-name people-name">
                  <span>Mother: </span>
                  <span>{this.state.mother.fullName}</span>
                </div>
                <div className={!config.isFromMother() ? "" : "hidden"}>
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

module.exports = function(gbl) {
  // Init application data
  global = gbl;
  config = global.config;
  ParentStore = global.stores.ParentStore;

  return ParentView;
};
