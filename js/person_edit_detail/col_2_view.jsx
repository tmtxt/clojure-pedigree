var React = require("react");

var Col2View = React.createClass({
  getInitialState: function() {
    return {showDeadDate: false};
  },

  makeStatusOptions: function() {
    var statuses =_.map(this.props.statuses, function(v, k){
      return (
        <option value={k}>{v}</option>
      );
    });

    return (
      <select className="form-control" ref="statuses" onChange={this.handleStatusChange}>
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
  },

  makeGenderOptions: function() {
    var genders =_.map(this.props.genders, function(v, k){
      return (
        <option value={k}>{v}</option>
      );
    });

    return (
      <select className="form-control">
        {genders}
      </select>
    );
  },

  render: function() {
    var statuses = this.makeStatusOptions();
    var genders = this.makeGenderOptions();

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
                {statuses}
              </div>
            </div>

            <div className={(this.state.showDeadDate ? '' : 'hidden ') + "profile-body-row"}>
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
                {genders}
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

        <div className="history-container">
          <div className="history-header">
            History
          </div>
          <div className="history-body">
            <textarea className="form-control" cols="30" id="" name="" rows="10"></textarea>
          </div>
        </div>
      </div>
    );
  }
});
module.exports = Col2View;
