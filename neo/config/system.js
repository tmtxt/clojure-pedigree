var config = new Map([
  ['serverPort', process.env.NEONODE_PORT],
  ['neo4jHost', process.env.NEO4J_HOST],
  ['neo4jPort', process.env.NEO4J_PORT]
]);

module.exports = config;
