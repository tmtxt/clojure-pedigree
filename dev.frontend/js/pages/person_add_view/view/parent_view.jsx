'use strict';

const React = require('react');
const _ = require('lodash');

module.exports = React.createClass({
  handleParentChange: function() {
    const tree = this.props.tree;
    const parentRole = tree.get('parentRole');
    const parentPartners = tree.get('parentPartners');
    const parentPartnerId = this.parentSelect.value;

    if (parentPartnerId != 'false') {
      const parentPartner = _.find(parentPartners, {id: parseInt(parentPartnerId)});
      if (parentRole == 'father') {
        tree.set('mother', parentPartner);
      } else {
        tree.set('father', parentPartner);
      }
    }
  },

  render: function() {
    const tree = this.props.tree;
    const father = tree.get('father');
    const mother = tree.get('mother');
    const parentRole = tree.get('parentRole');
    const parentPartners = tree.get('parentPartners');

    return (
      <div>
        <div className="parent-title">
          Parents
        </div>
        <div className="parent-help">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.
        </div>
        <div className="parent-body">
          <ul>
            <li>
              <input name="fatherId" type="hidden" value={father.id} />
              <div className="parent-image people-image">
                <img className="img-responsive img-rounded" alt="" src={father.picture} />
              </div>
              <div className="parent-info people-info">
                <div className="parent-name people-name">
                  <span>Cha: {father.fullName}</span>
                  {parentRole == 'mother' ?
                   <select className="form-control" ref={(ref) => this.parentSelect = ref}
                           onChange={this.handleParentChange}
                           name="parent-partner">
                     <option value="false">Chọn</option>
                     {_.map(parentPartners, (partner) => {
                        return <option key={partner.id} value={partner.id}>{partner.fullName}</option>;
                      })}
                   </select>
                   :
                   ''}
                </div>
              </div>
            </li>
            <li>
              <input name="motherId" type="hidden" value={mother.id}/>
              <div className="parent-image people-image">
                <img className="img-responsive img-rounded" alt="" src={mother.picture}/>
              </div>
              <div className="parent-info people-info">
                <div className="parent-name people-name">
                  <span>Mẹ: {mother.fullName}</span>
                  {parentRole == 'father' ?
                   <select className="form-control" ref={(ref) => this.parentSelect = ref}
                           onChange={this.handleParentChange}
                           name="parent-partner">
                     <option value="false">Chọn</option>
                     {_.map(parentPartners, (partner) => {
                        return <option key={partner.id} value={partner.id}>{partner.fullName}</option>;
                      })}
                   </select>
                   :
                   ''}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
});
