'use strict';

// services config
module.exports = {
  tree: {
    host: process.env.SVC_TREE_HOST,
    port: process.env.SVC_TREE_PORT
  },
  person: {
    host: process.env.SVC_PERSON_HOST,
    port: process.env.SVC_PERSON_PORT
  }
};
