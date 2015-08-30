var React = require('react');
var datepicker = require("./datepicker.js");
var _ = require("lodash");

var ProfileView = React.createClass({
  componentDidMount: function() {
    datepicker.init();
  },

  render: function() {
    var statuses =_.map(this.props.statuses, function(v, k){
      return (
        <option value="{k}">{v}</option>
      );
    });

    return (
      <div>
        <div className="profile-header">
          Hồ sơ
        </div>

        <div className="profile-body">
          <div className="profile-body-row">
            <div className="profile-body-left">
              Tên
            </div>
            <div className="profile-body-right">
              <input className="form-control" name="" type="text" value=""/>
            </div>
          </div>

          <div className="profile-body-row">
            <div className="profile-body-left">
              Ngày sinh
            </div>
            <div className="profile-body-right">
              <input className="form-control js-birthdate-input" name="" type="text" value=""/>
            </div>
          </div>

          <div className="profile-body-row">
            <div className="profile-body-left">
              Tình trạng
            </div>
            <div className="profile-body-right">
              <select className="form-control">
                {statuses}
              </select>
            </div>
          </div>

          <div className="profile-body-row">
            <div className="profile-body-left">
              Ngày mất
            </div>
            <div className="profile-body-right">
              <input className="form-control js-deathdate-input" name="" type="text" value=""/>
            </div>
          </div>

          <div className="profile-body-row">
            <div className="profile-body-left">
              Giới tính
            </div>
            <div className="profile-body-right">
              <input className="form-control" name="" type="text" value=""/>
            </div>
          </div>

          <div className="profile-body-row">
            <div className="profile-body-left">
              Điện thoại
            </div>
            <div className="profile-body-right">
              <input className="form-control" name="" type="text" value=""/>
            </div>
          </div>

          <div className="profile-body-row">
            <div className="profile-body-left">
              Địa chỉ
            </div>
            <div className="profile-body-right">
              <textarea className="form-control" cols="30" id="" name="" rows="3"></textarea>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
module.exports = ProfileView;
