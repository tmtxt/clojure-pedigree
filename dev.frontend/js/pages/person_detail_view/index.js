'use strict';

const BaobabReactApp = require('BaobabReactApp');

const MainView = require('./view.jsx');

const {tree} = BaobabReactApp.renderMainLayout(MainView, {
  person: 'abc'
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
  tree.set('person', result);
}
getData();
