var React = require("react");
var jquery = require("jquery");

var HistoryView = React.createClass({
  componentDidMount: function() {
    var historyEditor = jquery(".js-history-editor");
    historyEditor.markdown({
      iconlibrary: "fa",
      resize: "vertical",
      height: 300
    });
  },

  render: function() {
    return (
      <div className="history-container">
        <div className="history-header">
          History
        </div>
        <div className="history-body">
          <textarea className="form-control js-history-editor"></textarea>
        </div>
      </div>
    );
  }
});
module.exports = HistoryView;
