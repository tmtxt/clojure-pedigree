// Libs
var React = require("react");

// Application Data
var global;
var config;
var ParentStore;
var ParentAction;

// View class
var ParentView = React.createClass({
  getInitialState: function() {
    return {
      father: ParentStore.getFather(),
      mother: ParentStore.getMother(),
      parentPartners: ParentStore.getPartners()
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
          Thông tin Cha Mẹ
        </div>
        <div className="parent-help">
          Chọn cha mẹ cho thành viên mới này.
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
                  <span>Cha: </span>
                  <span>{this.state.father.fullName}</span>
                </div>
                <div className={!config.isFromFather() ? "" : "hidden"}>
                  <a className="btn btn-primary btn-sm" href="#" onClick={this.handleSelectFather}>Thay đổi</a>&nbsp;
                  <a className="btn btn-danger btn-sm" href="#" onClick={this.handleRemoveFather}>Xóa</a>
                </div>
              </div>
            </li>
            <li className={this.state.parentPartners.length === 0 ? "hidden" : ""}>
              <input name="motherId" type="hidden" value={this.state.mother.id}/>
              <div className="parent-image people-image">
                <img className="img-responsive img-rounded" alt="" src={this.state.mother.picture}/>
              </div>
              <div className="parent-info people-info">
                <div className="parent-name people-name">
                  <span>Mẹ: </span>
                  <span>{this.state.mother.fullName}</span>
                </div>
                <div className={!config.isFromMother() ? "" : "hidden"}>
                  <a className="btn btn-primary btn-sm" href="#" onClick={this.handleSelectMother}>Thay đổi</a>&nbsp;
                  <a className="btn btn-danger btn-sm" href="#" onClick={this.handleRemoveMother}>Xóa</a>
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
  ParentAction = global.actions.ParentAction;

  return ParentView;
};
