'use strict';

const _ = require('lodash');
const Baobab = require('baobab');
const React = require('react');
const ReactDOM = require('react-dom');
const baobabReact = require('baobab-react/higher-order');

exports.renderMainLayout = function(MainView){
  const tree = new Baobab({
    user: 'def'
  });

  const MainLayout = require('MainLayout');
  const RootedMainLayout = baobabReact.root(tree, MainLayout);
  const BranchedMainView = baobabReact.branch({
    user: ['user']
  }, MainView);

  ReactDOM.render(
    <RootedMainLayout>
      <BranchedMainView />
    </RootedMainLayout>,
    document.getElementById('pd-site-content')
  );
};
