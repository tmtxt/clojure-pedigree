// Libs
var React = require("react");
var _ = require("_");

// Application Data
var global;
var stores;
var config;
var PersonStore;

// View class
var Col2View = React.createClass({
  getInitialState: function() {
    return {
      person: PersonStore.getPerson()
    };
  },

  handleStatusChange: function(e) {

  },

  renderStatuses: function() {
    var statuses = _.map(config.getStatusesList(), function(v, k){
      return (
        <option key={k} value={k}>{v}</option>
      );
    });

    return (
      <select name="status" className="form-control"
              defaultValue={this.state.person.aliveStatus}
              ref="statuses" onChange={this.handleStatusChange}>
        {statuses}
      </select>
    );
  },

  renderGenders: function() {
    var genders = _.map(config.getGendersList(), function(v, k){
      return (
        <option key={k} value={k}>{v}</option>
      );
    });

    return (
      <select className="form-control"
              defaultValue={this.state.person.gender}
              name="gender">
        {genders}
      </select>
    );
  },

  render: function() {
    var statusesView = this.renderStatuses();
    var gendersView = this.renderGenders();

    return (
      <div className="editperson-col-2">
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
                <input className="form-control" name="name" type="text" defaultValue={this.state.person.fullName} />
              </div>
            </div>

            <div className="profile-body-row">
              <div className="profile-body-left">
                Ngày sinh
              </div>
              <div className="profile-body-right">
                <input className="form-control js-birthdate-input"
                       defaultValue={this.state.person.birthDate}
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

            <div className={(this.state.person.aliveStatus === "dead" ? '' : 'hidden ') + "profile-body-row"}>
              <div className="profile-body-left">
                Ngày mất
              </div>
              <div className="profile-body-right">
                <input className="form-control js-deathdate-input"
                       defaultValue={this.state.person.deathDate}
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

            <div className="profile-body-row">
              <div className="profile-body-left">
                Điện thoại
              </div>
              <div className="profile-body-right">
                <input className="form-control" name="phone" type="text" defaultValue={this.state.person.phoneNo}/>
              </div>
            </div>

            <div className="profile-body-row">
              <div className="profile-body-left">
                Địa chỉ
              </div>
              <div className="profile-body-right">
                <textarea className="form-control" cols="30" id="" name="address" rows="3">{this.state.person.address}</textarea>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
});

module.exports = function(gbl) {
  // Init application data
  global = gbl;
  stores = global.stores;
  config = global.config;
  PersonStore = stores.PersonStore;

  return Col2View;
};
