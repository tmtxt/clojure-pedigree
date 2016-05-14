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
  },

  pedigreeRelation: {
    host: process.env.SVC_PEDIGREE_RELATION_HOST,
    port: process.env.SVC_PEDIGREE_RELATION_PORT
  },

  marriageRelation: {
    host: process.env.SVC_MARRIAGE_RELATION_HOST,
    port: process.env.SVC_MARRIAGE_RELATION_PORT
  }
};
