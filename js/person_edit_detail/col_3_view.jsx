var React = require("react");

var Col3View = React.createClass({
  render: function() {
    return (
      <div className="editperson-col-3">
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
                  <img className="img-responsive img-rounded" alt="" src="/assets/img/o.jpg"/>
                </div>
                <div className="parent-info people-info">
                  <div className="parent-name people-name">
                    Father
                  </div>
                  <div>
                    <a href="">Select</a>
                  </div>
                </div>
              </li>
              <li>
                <div className="parent-image people-image">
                  <img className="img-responsive img-rounded" alt="" src="/assets/img/o.jpg"/>
                </div>
                <div className="parent-info people-info">
                  <div className="parent-name people-name">
                    Mother
                  </div>
                  <div>
                    <a href="">Select</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

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
