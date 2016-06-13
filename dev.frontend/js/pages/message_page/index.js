'use strict';

const BaobabReactApp = require('BaobabReactApp');

const MainView = require('./main_view.jsx');

BaobabReactApp.renderMainLayout(MainView, {}, '/');

document.title = 'Thông báo';

const {redirect} = window.params;
if (redirect) {
  window.setTimeout(function(){
    window.location = redirect;
  }, 5000);
}
