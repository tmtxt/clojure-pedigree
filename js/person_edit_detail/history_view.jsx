var React = require("react");

var HistoryView = React.createClass({
  render: function() {
    return (
      <div className="history-container">
        <div className="history-header">
          History
        </div>
        <div className="history-body">
          <textarea className="form-control" cols="30" id="" name="" rows="10"></textarea>
        </div>
      </div>
    );
  }
});
module.exports = HistoryView;
