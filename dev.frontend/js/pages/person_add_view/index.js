'use strict';

const BaobabReactApp = require('BaobabReactApp');
const pageUtil = require('./util.js');

const MainView = require('./view/main_view.jsx');

const initPerson = pageUtil.createEmptyPerson();

const {tree} = BaobabReactApp.renderMainLayout(MainView, {
  person: initPerson,
  fromRole: null,
  fromPerson: initPerson,
  initializing: true,

  // from parent
  father: null,
  mother: null,

  // from partner
  partner: null
}, '/person/add/from/:from/:personId');

// set page title
document.title = 'Tạo thành viên mới';

// set some data
tree.set('fromRole', tree.get(['params', 'from']));

// get init data
require('./init_data.js').createInitData(tree);
