'use strict';

const _ = require('lodash');
const Baobab = require('baobab');
const ReactDOM = require('react-dom');
const PropTypes = require('baobab-react/prop-types');
const baobabReact = require('baobab-react/higher-order');
const UrlPattern = require('url-pattern');

const user = require('./user.js');

function getBranchCursors(props) {
  const keys = Object.keys(props);
  const values = _.map(keys, (key) => {
    return [key];
  });

  return _.zipObject(keys, values);
}


exports.renderMainLayout = function(MainView, initProps, urlPattern, opts) {
  opts = opts || {};
  opts.layout = opts.layout || 'main';

  const pattern = new UrlPattern(urlPattern);
  const params = pattern.match(window.location.pathname);

  const tree = new Baobab(_.assign({
    user: 'def',
    params
  }, initProps));
  const appCursors = _.assign(
    getBranchCursors(initProps),
    {params: ['params'], user: ['user']}
  );

  const MainLayout = opts.layout == 'main' ? require('MainLayout') : require('FullWidthLayout');
  const RootedMainLayout = baobabReact.root(tree, MainLayout);
  const BranchedMainView = baobabReact.branch(appCursors, MainView);

  MainView.contextTypes = {
    tree: PropTypes.baobab
  };

  ReactDOM.render(
    <RootedMainLayout>
      <BranchedMainView />
    </RootedMainLayout>,
    document.getElementById('pd-site-content')
  );

  // get data
  user.getData(tree);

  return {
    tree
  };
};
