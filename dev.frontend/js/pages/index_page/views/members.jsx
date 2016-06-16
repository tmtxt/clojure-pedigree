'use strict';

const React = require('react');
const {Component} = React;

module.exports = class MembersView extends Component {

  render() {
    return (
      <div className="post post-right post-members">
        <div className="post-header">
          <h3 className="post-header-content">Thành viên</h3>
        </div>
        <div className="post-body">
          <ul className="post-members-list">
            <li>
              <div className="post-members-item">
                <img className="img-rounded" alt="" src="/assets/img/l.jpg"/>
                <div className="post-members-content">
                  <a href="/">
                    Dương Dươngg (1996)
                  </a>
                </div>
              </div>
            </li>
            <li>
              <div className="post-members-item">
                <img className="img-rounded" alt="" src="/assets/img/m.jpg"/>
                <div className="post-members-content">
                  <a href="/">
                    Diệu Thu (1996)
                  </a>
                </div>
              </div>
            </li>
            <li>
              <div className="post-members-item">
                <img className="img-rounded" alt="" src="/assets/img/n.jpg"/>
                <div className="post-members-content">
                  <a href="/">
                    Dương Dươngg (1996)
                  </a>
                </div>
              </div>
            </li>
            <li>
              <div className="post-members-item">
                <img className="img-rounded" alt="" src="/assets/img/o.jpg"/>
                <div className="post-members-content">
                  <a href="/">
                    Diệu Thu (1996)
                  </a>
                </div>
              </div>
            </li>
            <li>
              <div className="post-members-item">
                <img className="img-rounded" alt="" src="/assets/img/p.jpg"/>
                <div className="post-members-content">
                  <a href="/">
                    Dương Dươngg (1996)
                  </a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
};
