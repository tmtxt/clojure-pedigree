'use strict';

const _ = require('lodash');
const Baobab = require('baobab');
const React = require('react');
const ReactDOM = require('react-dom');
const baobabReact = require('baobab-react/higher-order');

function getBranchCursors(props) {
  const keys = Object.keys(props);
  const values = _.map(keys, (key) => {
    return [key];
  });

  return _.zipObject(keys, values);
}


exports.renderMainLayout = function(MainView, props){
  const tree = new Baobab(_.assign({
    user: 'def'
  }, props));

  const MainLayout = require('MainLayout');
  const RootedMainLayout = baobabReact.root(tree, MainLayout);
  const BranchedMainView = baobabReact.branch(getBranchCursors(props), MainView);

  ReactDOM.render(
    <RootedMainLayout>
      <BranchedMainView />
    </RootedMainLayout>,
    document.getElementById('pd-site-content')
  );
};
