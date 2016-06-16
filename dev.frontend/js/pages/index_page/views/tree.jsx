'use strict';

const React = require('react');
const {Component} = React;

module.exports = class TreeView extends Component {

  render() {
    return (
      <div className="post post-left post-tree">
        <div className="post-header">
          <h3 className="post-header-content">Cây gia phả</h3>
        </div>
        <div className="post-body">
          <div className="post-tree-graph" id="js-tree-container">
          </div>
          <div className="post-tree-content">
            <div className="post-tree-text">
              Tree desc
            </div>
            <div className="post-tre-link">
              <a href="/tree/view/">
                Xem cây gia phả chi tiết
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
