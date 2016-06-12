'use strict';

const React = require('react');
const {Component} = React;

module.exports = class PartnerView extends Component {
  render() {
    const tree = this.props.tree;
    const partner = tree.get('partner');

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
                <input name="partnerId" type="hidden" value={partner.id}/>
                <div className="partner-image people-image">
                  <img className="img-responsive img-rounded" alt="" src={partner.picture}/>
                </div>
                <div className="partner-info people-info">
                  <div className="partner-name people-name">
                    {partner.fullName}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
