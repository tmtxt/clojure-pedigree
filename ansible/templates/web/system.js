var config = new Map([
  ['serverPort', {{ neo_node_port }}],
  ['neo4jHost', {{ neo_neo4j_host | to_json }}],
  ['neo4jPort', {{ neo_neo4j_port }}]
]);

module.exports = config;
