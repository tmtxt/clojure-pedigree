var React = require("react");

// Global Flux
var global = require("./global.js");
var FamilyStore = global.stores.family;
var FamilyAction = global.actions.family;

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
        <li key={partner.id}>
          <div className="partner-image people-image">
            <img className="img-responsive img-rounded" alt="" src={partner.picture}/>
          </div>
          <div className="partner-info people-info">
            <div className="partner-name people-name">
              {partner.fullName}
            </div>
            <div className={partner.canRemove ? "" : "hidden"}>
              <a href="">Remove</a>
            </div>
          </div>
        </li>
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
      addText = "Add Husband";
    } else {
      addText = "Add Wife";
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
          <div className="family-buttons">
            <button className="btn btn-success" onClick={this.handleAdd}>
              {addText}
            </button>
          </div>
        </div>
      </div>
    );
  }
});
module.exports = FamilyView;
