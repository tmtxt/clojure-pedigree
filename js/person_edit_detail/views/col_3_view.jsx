// Libs
var React = require("react");

// Application Data
var global;
var config;

// Sub views
var ParentView;
var PartnerView;
var ChildView;

// View Class
var Col3View = React.createClass({
  renderParentView: function() {
    if (config.isFromParent()) {
      return (
        <ParentView />
      );
    }
    return null;
  },

  renderPartnerView: function() {
    if (config.isFromPartner()) {
      return (
        <PartnerView />
      );
    }
  },

  render: function() {
    var parentView = this.renderParentView();
    var partnerView = this.renderPartnerView();

    return (
      <div className="editperson-col-3">
        {parentView}
        {partnerView}
      </div>
    );
  }
});

module.exports = function(gbl) {
  // Init application data
  global = gbl;
  config = global.config;

  // Init sub views
  ParentView = require("./parent_view.jsx")(gbl);
  PartnerView = require("./partner_view.jsx")(gbl);

  return Col3View;
};
