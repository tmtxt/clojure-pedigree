'use strict';

const BaobabReactApp = require('BaobabReactApp');
const MainView = require('./main_view.jsx');

const {tree} = BaobabReactApp.renderMainLayout(MainView, {
  pedigreeTree: null,
  initializing: true
}, '/tree/index');

document.title = 'Cây gia phả';

// get data
require('./data.js').getData(tree);
