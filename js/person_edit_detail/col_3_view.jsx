var React = require("react");

var ParentView = require("./parent_view.jsx");

var Col3View = React.createClass({
  render: function() {
    return (
      <div className="editperson-col-3">
        <ParentView parent={this.props.parent} />

        <div className="family-container">
          <div className="family-title">
            Family
          </div>
          <div className="family-help">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit
          </div>
          <div className="family-body">
            <div className="family-list">
              <ul className="partner-list">
                <li>
                  <div className="partner-image people-image">
                    <img className="img-responsive img-rounded" alt="" src="/assets/img/m.jpg"/>
                  </div>
                  <div className="partner-info people-info">
                    <div className="partner-name people-name">
                      Wife 1
                    </div>
                    <div>
                      <a href="">Remove</a>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="partner-image people-image">
                    <img className="img-responsive img-rounded" alt="" src="/assets/img/j.jpg"/>
                  </div>
                  <div className="partner-info people-info">
                    <div className="partner-name people-name">
                      Wife 2
                    </div>
                    <div>
                      <a href="">Remove</a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="family-buttons">
              <button className="btn btn-success">Add</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
module.exports = Col3View;
