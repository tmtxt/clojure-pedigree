'use strict';

const React = require('react');
const {Component} = React;

module.exports = class LinkView extends Component {

  render() {
    return (
      <div className="post post-right post-links">
        <div className="post-header">
          <h3 className="post-header-content">Liên kết khác</h3>
        </div>
        <div className="post-body">
          <ul className="post-links-list fa-ul">
            <li>
              <i className="fa-li fa fa-lg fa-caret-right"></i>
              <div className="post-links-title">
                <a href="/">
                  Mã nguồn
                </a>
              </div>
            </li>
            <li>
              <i className="fa-li fa fa-lg fa-caret-right"></i>
              <div className="post-links-title">
                <a href="/">
                  Liên hệ
                </a>
              </div>
            </li>
            <li>
              <i className="fa-li fa fa-lg fa-caret-right"></i>
              <div className="post-links-title">
                <a href="/">
                  Thông báo
                </a>
              </div>
            </li>
            <li>
              <i className="fa-li fa fa-lg fa-caret-right"></i>
              <div className="post-links-title">
                <a href="/">
                  Others
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
};
