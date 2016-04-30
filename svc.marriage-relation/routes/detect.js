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
  const person = this.request.body;
  const gender = person.gender;
  const role = detectPartnerRole(gender);
  this.body = {
    success: true,
    data: role
  };
}

router.get('/partnerRole/single', partnerRoleSingleHandler);

module.exports = router;
