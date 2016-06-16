'use strict';

const BaobabReactApp = require('BaobabReactApp');

const MainView = require('./main_view.jsx');

const {tree} = BaobabReactApp.renderMainLayout(MainView, {
  initializing: true
}, '/');

document.title = 'Trần Văn Gia Phả';
