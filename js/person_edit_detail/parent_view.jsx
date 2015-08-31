var React = require("react");

var ParentView = React.createClass({
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
    );
  }
});
module.exports = ParentView;
