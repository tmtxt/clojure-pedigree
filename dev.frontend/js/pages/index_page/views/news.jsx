'use strict';

const React = require('react');
const {Component} = React;

module.exports = class NewsView extends Component {

  render() {
    return (
      <div className="post post-left post-news">
        <div className="post-header">
          <h3 className="post-header-content">Tin vắn dòng họ</h3>
        </div>
        <div className="post-body">
          <div className="post-news-left">
            <div className="post-news-image">
              <img alt="" src="/assets/img/a.jpg"/>
            </div>
            <div className="post-image-title">
              <h4>
                <a href="/">Cháu Trần Xuân Trường trúng số độc đắc 100 triệu đồng</a>
              </h4>
            </div>
            <div className="post-image-date">
              16/05/2015
            </div>
            <div className="post-image-content">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enimad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </div>
          </div>
          <div className="post-news-right">
            <ul className="post-news-list fa-ul">
              <li className="hidden-xs">
                <i className="fa-li fa fa-lg fa-caret-right"></i>
                <div className="post-news-title">
                  <a href="/">Cháu Trần Xuân Trường trúng số độc đắc 100 triệu đồng</a>
                </div>
                <div className="post-news-date">
                  16/05/2015
                </div>
              </li>
              <li className="hidden-xs">
                <i className="fa-li fa fa-lg fa-caret-right"></i>
                <div className="post-news-title">
                  <a href="/">Cháu Trần Xuân Trường tham dự hôi thi IT khỏe đẹp lần 3</a>
                </div>
                <div className="post-news-date">
                  16/05/2015
                </div>
              </li>
              <li className="hidden-xs">
                <i className="fa-li fa fa-lg fa-caret-right"></i>
                <div className="post-news-title">
                  <a href="/">Cháu Trần Xuân Trường mua máy Macbook Pro 20 củ</a>
                </div>
                <div className="post-news-date">
                  16/05/2015
                </div>
              </li>
              <li className="hidden-xs">
                <i className="fa-li fa fa-lg fa-caret-right"></i>
                <div className="post-news-title">
                  <a href="/">Cháu Trần Xuân Trường bị công an gọi lên điều tra</a>
                </div>
                <div className="post-news-date">
                  16/05/2015
                </div>
              </li>
              <li className="hidden-xs">
                <i className="fa-li fa fa-lg fa-caret-right"></i>
                <div className="post-news-title">
                  <a href="/">Cháu Trần Xuân Trường bán máy Macbook Air với giá 15 củ</a>
                </div>
                <div className="post-news-date">
                  16/05/2015
                </div>
              </li>
              <li className="post-news-more">
                <a href="/">
                  Xem thêm tin tức
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
};
