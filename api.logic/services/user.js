const config = require('../config');
const Service = require('./service.js');
const svcUser = new Service(config.svcUserHost, config.svcUserPort);

exports.authenticate = function*(username, password, context) {
  const data = {username, password};
  const result = yield svcUser.send('post', '/user/auth', data, context);
  return result;
};
