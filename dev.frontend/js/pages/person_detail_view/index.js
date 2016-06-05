'use strict';

const BaobabReactApp = require('BaobabReactApp');

const MainView = require('./view.jsx');

const {tree} = BaobabReactApp.renderMainLayout(MainView, {
  personInfo: null
}, '/person/detail/:personId');

require('./init.js').getData(tree);
