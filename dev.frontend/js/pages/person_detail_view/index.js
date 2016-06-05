'use strict';

const BaobabReactApp = require('BaobabReactApp');

const MainView = require('./view.jsx');

BaobabReactApp.renderMainLayout(MainView, {
  person: null
}, '/person/detail/:personId');

const $ = window.$;
async function getData() {
  const result = await $.get({
    url: '/api/person/detail',
    data: {
      personId: 15
    }
  });
  console.log(result);
}
getData();
