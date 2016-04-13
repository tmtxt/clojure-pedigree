const request = require('./request.js');

exports.authenticate = function*(username, password) {
  return yield request.post('/user/auth', {});
};
