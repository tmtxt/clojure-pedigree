'use strict';

const _ = require('lodash');
const React = require('react');
const markdown = require('markdown');
const baobabReact = require('baobab-react/higher-order');

const ParentView = require('./parent_view.jsx');
const PartnerView = require('./partner_view.jsx');


module.exports = React.createClass({
  render: function() {

    console.log(this.props.person);

    return (
      <div className="page-persondetail">
        <div className="persondetail-header">
          <div className="persondetail-title">

          </div>

          <div className="persondetail-buttons">
            <a href="/tree/view/person/15" className="btn btn-info">Xem cây gia phả</a>
            {_.get(this.props.user, ['authenticated']) ?
             <a href={'/person/edit/' + _.get(this.props.person, ['id'])}
                className="btn btn-success">Chỉnh sửa</a> : ""}
             {_.get(this.props.user, ['authenticated']) ?
              <a href={'/person/delete/' + _.get(this.props.person, ['id'])}
                 className="btn btn-danger">Xóa</a> : ""}
          </div>
        </div>

        <div className="persondetail-body">
          <div className="persondetail-col-1">
            {this.props.person ?
             <img className="img-responsive img-thumbnail" alt="" src={this.props.person.picture} /> :
             <i className="fa fa-spinner fa-spin fa-5x fa-fw"></i>}
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
                    {this.props.person ?
                     <span>{this.props.person.fullName}</span> :
                     <i className="fa fa-spinner fa-spin fa-fw"></i>
                    }
                  </div>
                </div>

                <div className="profile-body-row">
                  <div className="profile-body-left">
                    Ngày sinh
                  </div>
                  <div className="profile-body-right">
                    {this.props.person ?
                     <span>{this.props.person.birthDate}</span> :
                     <i className="fa fa-spinner fa-spin fa-fw"></i>
                    }
                  </div>
                </div>

                <div className="profile-body-row">
                  <div className="profile-body-left">
                    Tình trạng
                  </div>
                  <div className="profile-body-right">
                    {this.props.person ?
                     <span>{this.props.person.aliveStatus}</span> :
                     <i className="fa fa-spinner fa-spin fa-fw"></i>
                    }
                  </div>
                </div>

                <div className="profile-body-row">
                  <div className="profile-body-left">
                    Ngày mất
                  </div>
                  <div className="profile-body-right">
                    {this.props.person ?
                     <span>{this.props.person.deathDate}</span> :
                     <i className="fa fa-spinner fa-spin fa-fw"></i>
                    }
                  </div>
                </div>

                <div className="profile-body-row">
                  <div className="profile-body-left">
                    Giới tính
                  </div>
                  <div className="profile-body-right">
                    {this.props.person ?
                     <span>{this.props.person.gender}</span> :
                     <i className="fa fa-spinner fa-spin fa-fw"></i>
                    }
                  </div>
                </div>
              </div>
            </div>

            <div className="persondetail-history">
              <div className="history-header">
                Chú thích
              </div>
              <div className="js-persondetail-history history-body">
                {this.props.person ?
                 markdown.toHTML(this.props.person.summary || "") :
                 <i className="fa fa-spinner fa-spin fa-fw"></i>
                }
              </div>
            </div>
          </div>

          <div className="persondetail-col-3">
            <ParentView parents={this.props.parents} />

            <PartnerView partners={this.props.partners} />
          </div>
        </div>
      </div>
    );
  }
});
