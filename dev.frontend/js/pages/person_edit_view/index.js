'use strict';

const BaobabReactApp = require('BaobabReactApp');
const personUtil = require('person_util.js');

const MainView = require('./main_view.jsx');

const {tree} = BaobabReactApp.renderMainLayout(MainView, {
  person: personUtil.createEmptyPerson(),
  initializing: true
}, '/person/edit/:personId');

document.title = 'Chỉnh sửa thông tin thành viên';
