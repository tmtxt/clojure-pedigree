'use strict';

const React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <footer className="site-footer">
        <div className="container-fluid footer-nav">
          <div className="container footer-text">
            <nav className="footer-content">
              <ul className="footer-menu">
                <li>
                  <a href="/">Trang chủ</a>
                </li>
                <li>
                  <a href="/tree/view">Cây gia phả</a>
                </li>
                <li>
                  <a href="/">Lịch sử dòng họ</a>
                </li>
                <li>
                  <a href="/">Liên hệ</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="container-fluid footer-banner">
          <div className="container">
            © Copyright 2015 TruongTx - All rights reserved
          </div>
        </div>
      </footer>
    );
  }
});
