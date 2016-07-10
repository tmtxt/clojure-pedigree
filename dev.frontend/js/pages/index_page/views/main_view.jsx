'use strict';

const React = require('react');
const {Component} = React;

const PrefaceView = require('./preface.jsx');
const MembersView = require('./members.jsx');
const NewsView = require('./news.jsx');
const ImagesView = require('./images.jsx');
const TreeView = require('./tree.jsx');
const LinkView = require('./links.jsx');


module.exports = class MainView extends Component {

  render() {

    return (
      <div className="page-index">
        <div className="site-container-row">
          <PrefaceView preface={this.props.preface} />
          {/* <MembersView /> */}
        </div>

        {/* <div className="site-container-row">
        <NewsView />
        <ImagesView />
        </div> */}

        <div className="site-container-row">
          <TreeView />
          <LinkView />
        </div>
      </div>
    );
  }
};
