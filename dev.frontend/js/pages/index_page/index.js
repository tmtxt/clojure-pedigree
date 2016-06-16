'use strict';

const BaobabReactApp = require('BaobabReactApp');

const MainView = require('./views/main_view.jsx');

const {tree} = BaobabReactApp.renderMainLayout(MainView, {
  initializing: true,
  preface: null,
  treeDesc: null
}, '/');

document.title = 'Trần Văn Gia Phả';

require('./init_data.js').createInitData(tree);
