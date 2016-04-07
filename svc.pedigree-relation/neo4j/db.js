'use strict';

const seraph = require('seraph');
const config = require('../config');

module.exports = seraph(`http://${config.neo4jHost}:${config.neo4jPort}`);
