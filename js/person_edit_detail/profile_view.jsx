// Libs
var React = require("react");
var jquery = require("jquery");

// Global Flux
var global = require("./global.js");
PersonStore = global.stores.person;
FormStore = global.stores.form;

// Util functions
function initDatePicker() {
  // Find components
  var birthDateInput = jquery('.js-birthdate-input');
  var deathDateInput = jquery('.js-deathdate-input');

  birthDateInput.datepicker({
    language: 'vi'
  });
  deathDateInput.datepicker({
    language: 'vi'
  });
}

// Main View
var ProfileView = React.createClass({
  showDeadDate: function() {
    if (FormStore.onEditPage() && PersonStore.getPerson().aliveStatus == "dead") {
      return true;
    }
    return false;
  },

  showAliveStatus: function() {
    var person = PersonStore.getPerson();
    return person.aliveStatus;
  },

  getInitialState: function() {
    return {
      showDeadDate: this.showDeadDate(),
      aliveStatus: this.showAliveStatus(),
      person: PersonStore.getPerson()
    };
  },

  componentDidMount: function() {
    initDatePicker();
  },

  makeStatusOptions: function() {
    var This = this;

    var statuses =_.map(this.props.statuses, function(v, k){
      return (
        <option key={k} value={k}>{v}</option>
      );
    });

    return (
      <select name="status" className="form-control"
              value={this.state.aliveStatus}
              ref="statuses" onChange={this.handleStatusChange}>
        {statuses}
      </select>
    );
  },

  handleStatusChange: function(e) {
    var status = React.findDOMNode(this.refs.statuses).value.trim();
    if (status === "dead") {
      this.setState({showDeadDate: true});
    } else {
      this.setState({showDeadDate: false});
    }

    this.setState({aliveStatus: status});
  },

  makeGenderOptions: function() {
    var genders =_.map(this.props.genders, function(v, k){
      return (
        <option key={k} value={k}>{v}</option>
      );
    });

    return (
      <select className="form-control" name="gender">
        {genders}
      </select>
    );
  },

  render: function() {
    var statuses = this.makeStatusOptions();
    var genders = this.makeGenderOptions();

    return (
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
              <input className="form-control" name="name" type="text" defaultValue={this.state.person.fullName }/>
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
              {statuses}
            </div>
          </div>

          <div className={(this.state.showDeadDate ? '' : 'hidden ') + "profile-body-row"}>
            <div className="profile-body-left">
              Ngày mất
            </div>
            <div className="profile-body-right">
              <input className="form-control js-deathdate-input" name="deathdate" type="text" />
            </div>
          </div>

          <div className="profile-body-row">
            <div className="profile-body-left">
              Giới tính
            </div>
            <div className="profile-body-right">
              {genders}
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
    );
  }
});
module.exports = ProfileView;
