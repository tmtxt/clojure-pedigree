// Libs
var React = require("react");

// Application Data
var global;
var config;
var PartnerStore;

// View class
var PartnerView = React.createClass({
  getInitialState: function() {
    return {
      partner: PartnerStore.getPartner()
    };
  },

  render: function() {
    return (
      <div>
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
                <input name="partnerId" type="hidden" value={this.state.partner.id}/>
                <div className="partner-image people-image">
                  <img className="img-responsive img-rounded" alt="" src={this.state.partner.picture}/>
                </div>
                <div className="partner-info people-info">
                  <div className="partner-name people-name">
                    {this.state.partner.fullName}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = function(gbl) {
  // Init application data
  global = gbl;
  config = global.config;
  PartnerStore = global.stores.PartnerStore;

  return PartnerView;
};
