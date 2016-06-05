'use strict';

const BaobabReactApp = require('BaobabReactApp');

const MainView = require('./view.jsx');

const {tree} = BaobabReactApp.renderMainLayout(MainView, {
  person: null,
  parents: null,
  partners: null
}, '/person/detail/:personId');

require('./init.js').getData(tree);
