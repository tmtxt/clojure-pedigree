'use strict';

const BaobabReactApp = require('BaobabReactApp');
const MainView = require('./main_view.jsx');

const {tree} = BaobabReactApp.renderMainLayout(MainView, {
  tree: null
}, '/tree/index');

document.title = 'Cây gia phả';
