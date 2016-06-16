'use strict';

const React = require('react');
const {Component} = React;

module.exports = class PrefaceView extends Component {

  render() {
    return (
      <div className="post post-left post-preface">
        <div className="post-header">
          <h3 className="post-header-content">Lời tâm huyết</h3>
        </div>
        { this.props.preface ?
          <div className="post-body">
            <div className="post-image">
              <img className="hidden-xs" alt="" src="/assets/img/preface.jpg"/>
              <img className="hidden-sm hidden-md hidden-lg" alt="" src="/assets/img/preface.jpg"/>
            </div>
            <div className="post-content">
              {this.props.preface.content}
            </div>
          </div>
          :
          <i className="fa fa-spinner fa-spin fa-5x fa-fw"></i>
        }
      </div>
    );
  }
};
