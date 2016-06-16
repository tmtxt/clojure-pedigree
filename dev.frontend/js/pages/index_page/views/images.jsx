'use strict';

const React = require('react');
const {Component} = React;

module.exports = class ImagesView extends Component {

  render() {
    return (
      <div className="post post-right post-images">
        <div className="post-header">
          <h3 className="post-header-content">Hình ảnh</h3>
        </div>
        <div className="post-body">
          <div className="post-images-big">
            <a href="/">
              <img className="img-responsive" alt="" src="/assets/img/b.jpg"/>
            </a>
          </div>

          <div className="post-images-line">
            <div>
              <a href="/">
                <img alt="" src="/assets/img/c.jpg"/>
              </a>
            </div>
            <div>
              <a href="">
                <img alt="" src="/assets/img/h.jpg"/>
              </a>
            </div>
            <div>
              <a href="">
                <img alt="" src="/assets/img/j.jpg"/>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
