'use strict';

const React = require('react');

const personUtil = require('person_util.js');


module.exports = React.createClass({
  renderStatuses: function() {
    const statuses = personUtil.statusesList;

    return (
      <select name="status" className="form-control"
              defaultValue={this.props.person.aliveStatus}
              ref="statuses">
        {_.map(statuses, function(v, k) {
           return (
             <option key={k} value={k}>{v}</option>
           );
         })}
      </select>
    );
  },

  renderGenders: function() {
    const genders = personUtil.gendersList;

    return (
      <select className="form-control"
              defaultValue={this.props.person.gender}
              name="gender">
        {_.map(genders, function(v, k){
           return (
             <option key={k} value={k}>{v}</option>
           );
         })}
      </select>
    );
  },

  render: function() {
    const statusesView = this.renderStatuses();
    const gendersView = this.renderGenders();

    return (
      <div className="editperson-col-2">
        <input name="personid" type="hidden" value={this.props.person.id} />

        <div className="profile-container">
          <div className="profile-header">
            Hồ sơ
          </div>

          <div className="profile-body">
            <div className="profile-body-row">
              <div className="profile-body-left">
                Tên
              </div>
              <div className="profile-body-right">
                <input className="form-control" name="name" type="text"
                       defaultValue={this.props.person.fullName} />
              </div>
            </div>

            <div className="profile-body-row">
              <div className="profile-body-left">
                Ngày sinh
              </div>
              <div className="profile-body-right">
                <input className="form-control js-birthdate-input"
                       defaultValue={this.props.person.birthDate}
                       name="birthdate" type="text"/>
              </div>
            </div>

            <div className="profile-body-row">
              <div className="profile-body-left">
                Tình trạng
              </div>
              <div className="profile-body-right">
                {statusesView}
              </div>
            </div>

            <div className={(this.props.person.aliveStatus === "dead" ? '' : 'hidden ') + "profile-body-row"}>
              <div className="profile-body-left">
                Ngày mất
              </div>
              <div className="profile-body-right">
                <input className="form-control js-deathdate-input"
                       defaultValue={this.props.person.deathDate}
                       name="deathdate" type="text" />
              </div>
            </div>

            <div className="profile-body-row">
              <div className="profile-body-left">
                Giới tính
              </div>
              <div className="profile-body-right">
                {gendersView}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
});
