var React = require("react");

// Global Flux
var global = require("./global.js");

var ChildView = React.createClass({
  render: function() {
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
                  <img className="img-responsive img-rounded" alt="" src="/assets/img/d.jpg"/>
                </div>
                <div className="partner-info people-info">
                  <div className="partner-name people-name">
                    Child name
                  </div>
                  <div className="">
                    <a href="" onClick={this.handleRemove}>Remove</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div className="family-buttons">
            <button className="btn btn-success" onClick={this.handleAdd}>
              Add
            </button>
          </div>
        </div>
      </div>
    );
  }
});
module.exports = ChildView;
