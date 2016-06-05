'use strict';

const _ = require('lodash');
const Baobab = require('baobab');
const React = require('react');
const ReactDOM = require('react-dom');
const baobabReact = require('baobab-react/higher-order');
const UrlPattern = require('url-pattern');

function getBranchCursors(props) {
  const keys = Object.keys(props);
  const values = _.map(keys, (key) => {
    return [key];
  });

  return _.zipObject(keys, values);
}


exports.renderMainLayout = function(MainView, initProps, urlPattern) {
  const pattern = new UrlPattern(urlPattern);
  const params = pattern.match(window.location.pathname);

  const tree = new Baobab(_.assign({
    user: 'def',
    params
  }, initProps));
  const appCursors = _.assign(getBranchCursors(initProps), {params: ['params']});

  const MainLayout = require('MainLayout');
  const RootedMainLayout = baobabReact.root(tree, MainLayout);
  const BranchedMainView = baobabReact.branch(appCursors, MainView);

  ReactDOM.render(
    <RootedMainLayout>
      <BranchedMainView />
    </RootedMainLayout>,
    document.getElementById('pd-site-content')
  );

  return {
    tree
  };
};
