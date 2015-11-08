var React = require("react");

// Global Flux
var global = require("./global.js");
var FamilyStore = global.stores.family;
var FamilyAction = global.actions.family;

var PartnerView = React.createClass({
  getInitialState: function() {
    return {
      partner: this.props.partner
    };
  },

  handleRemove: function(e){
    e.preventDefault();
    FamilyAction.removePartner(this.state.partner.id);
  },

  render: function() {
    return (
      <li>
        <input name="partnerId" type="hidden" value={this.state.partner.id}/>
        <div className="partner-image people-image">
          <img className="img-responsive img-rounded" alt="" src={this.state.partner.picture}/>
        </div>
        <div className="partner-info people-info">
          <div className="partner-name people-name">
            {this.state.partner.fullName}
          </div>
          <div className={this.state.partner.canRemove ? "" : "hidden"}>
            <a href="" onClick={this.handleRemove}>Remove</a>
          </div>
        </div>
      </li>
    );
  }
});

var FamilyView = React.createClass({
  getInitialState: function() {
    return {
      partners: FamilyStore.getPartners()
    };
  },

  componentDidMount: function() {
    FamilyStore.bindChanged(this.partnersChanged);
  },

  componentWillUnmount: function() {
    FamilyStore.unbindChanged(this.partnersChanged);
  },

  partnersChanged: function() {
    var partners = FamilyStore.getPartners();
    this.setState({
      partners: partners
    });
  },

  getPartnersList: function() {
    var partnersList = this.state.partners.map(function(partner){
      return (
        <PartnerView key={partner.id} partner={partner} />
      );
    });

    return partnersList;
  },

  handleAdd: function(e) {
    e.preventDefault();
    FamilyAction.addPartner();
  },

  render: function() {
    var rootClassName = "family-container";
    if (!global.addFromPartner()) {
      rootClassName += " hidden";
    }

    var partnersList = this.getPartnersList();

    var addText;
    if(FamilyStore.addFromHusband()) {
      addText = "Add More Husband";
    } else {
      addText = "Add More Wife";
    }

    return (
      <div className={rootClassName}>
        <div className="family-title">
          Family
        </div>
        <div className="family-help">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit
        </div>
        <div className="family-body">
          <div className="family-list">
            <ul className="partner-list">
              {partnersList}
            </ul>
          </div>
        </div>
      </div>
    );
  }
});
module.exports = FamilyView;
