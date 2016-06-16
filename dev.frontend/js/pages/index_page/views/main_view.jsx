'use strict';

const React = require('react');
const {Component} = React;

const PrefaceView = require('./preface.jsx');
const MembersView = require('./members.jsx');


module.exports = class MainView extends Component {

  render() {

    return (
      <div className="page-index">
        <div className="site-container-row">
          <PrefaceView preface={this.props.preface} />
          <MembersView />
        </div>
      </div>
    );
  }
};
