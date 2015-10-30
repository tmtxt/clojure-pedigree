var React = require("react");

var ParentView = require("./parent_view.jsx");
var FamilyView = require("./family_view.jsx");
var ChildView = require("./child_view.jsx");

var Col3View = React.createClass({
  render: function() {
    return (
      <div className="editperson-col-3">
        <ParentView />
        <FamilyView />
        <ChildView />
      </div>
    );
  }
});
module.exports = Col3View;
