'use strict';

const router = require('koa-router')();

function detectPartnerRole(gender) {
  switch (gender) {
    case 'male':
      return 'husband';
    case 'female':
      return 'wife';
    case 'gay':
      return 'wife';
    case 'les':
      return 'husband';
    default:
      return 'husband';
  }
}

// Koa handler function
function* partnerRoleSingleHandler() {
  const logTrace = this.logTrace;
  const person = this.request.body;
  const gender = person.gender;
  logTrace.add('info', 'partnerRoleSingleHandler()', `Gender: ${person}`);

  const role = detectPartnerRole(gender);
  logTrace.add('info', 'partnerRoleSingleHandler()', `Role: ${role}`);

  this.body = {
    success: true,
    data: role
  };
}

router.get('/partnerRole/single', partnerRoleSingleHandler);

module.exports = router;
