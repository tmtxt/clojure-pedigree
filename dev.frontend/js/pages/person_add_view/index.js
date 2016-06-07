'use strict';

const BaobabReactApp = require('BaobabReactApp');
const personUtil = require('person_util.js');

const MainView = require('./main_view.jsx');

const initPerson = personUtil.createEmptyPerson();
initPerson.picture = personUtil.getDefaultPictureLink();

BaobabReactApp.renderMainLayout(MainView, {
  person: initPerson
}, '/person/add/from/:from/:personId');

document.title = 'Tạo thành viên mới';
