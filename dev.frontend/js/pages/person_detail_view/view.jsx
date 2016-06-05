'use strict';

const React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div className="page-persondetail">
        <div className="persondetail-header">
          <div className="persondetail-title">
            {this.props.person}
          </div>

          <div className="persondetail-buttons">
            <a href="/tree/view/person/15" className="btn btn-info">Xem cây gia phả</a>
          </div>
        </div>

        <div className="persondetail-body">
          <div className="persondetail-col-1">
            <img className="img-responsive img-thumbnail" alt="" src="" />
          </div>

          <div className="persondetail-col-2">
            <div className="persondetail-profile">
              <div className="profile-header">
                Thông tin
              </div>

              <div className="profile-body">
                <div className="profile-body-row">
                  <div className="profile-body-left">
                    Họ và Tên
                  </div>
                  <div className="profile-body-right">
                    {this.props.personInfo ?
                     <span>{this.props.personInfo['full-name']}</span> :
                     <i className="fa fa-spinner fa-spin fa-fw"></i>
                    }
                  </div>
                </div>

                <div className="profile-body-row">
                  <div className="profile-body-left">
                    Ngày sinh
                  </div>
                  <div className="profile-body-right">
                    Birthdate
                  </div>
                </div>

                <div className="profile-body-row">
                  <div className="profile-body-left">
                    Tình trạng
                  </div>
                  <div className="profile-body-right">
                    Alive
                  </div>
                </div>
              </div>
            </div>

            <div className="persondetail-history">
              <div className="history-header">
                Chú thích
              </div>
              <div className="js-persondetail-history history-body">
              </div>
            </div>
          </div>

          <div className="persondetail-col-3">
          </div>
        </div>
      </div>
    );
  }
});
