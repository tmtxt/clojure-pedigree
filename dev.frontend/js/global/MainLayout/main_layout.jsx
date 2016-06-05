'use strict';

const React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <header className="site-header">
          <div className="container-fluid header-banner">
            <div className="container">
              <div className="header-site-name">
                Trần Văn gia phả
              </div>
              <div className="header-site-headline">
                Gìn giữ cho muôn đời sau
              </div>
            </div>
          </div>

          <div className="container-fluid header-nav">
            <div className="container">
              <nav className="header-content" role="banner">
                <ul className="header-content--left header-menu">
                  <li><a href="/">Trang chủ</a></li>
                  <li><a href="#">Thành viên</a></li>
                  <li><a href="/tree/view/">Cây gia phả</a></li>
                  <li><a href="#">Lịch sử dòng họ</a></li>
                  <li><a href="#">Liên hệ</a></li>
                </ul>
                <ul className="header-content--right header-menu">
                  <li><a href="/login">Đăng nhập</a></li>
                </ul>
              </nav>
            </div>
          </div>
        </header>
      </div>
    );
  }
});
