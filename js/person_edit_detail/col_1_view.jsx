var React = require("react");

var Col1View = React.createClass({
  render: function() {
    return (
      <div className="editperson-col-1">
        <div className="col-1-img">
          <img className="img-responsive img-thumbnail" alt="" src="/assets/img/t.jpg"/>
        </div>
        <div className="col-1-buttons">
          <button className="btn btn-success">Select</button>
          <button className="btn btn-danger">Delete</button>
        </div>
      </div>
    );
  }
});
module.exports = Col1View;
