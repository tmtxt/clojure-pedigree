module.exports = {
  serverPort: process.env.DB_PERSON_PORT,

  postgresHost: process.env.POSTGRES_HOST,
  postgresPort: process.env.POSTGRES_PORT,
  postgresUser: process.env.POSTGRES_USER,
  postgresPassword: process.env.POSTGRES_PASSWORD,
  postgresDb: process.env.POSTGRES_DB,

  neo4jHost: process.env.NEO4J_HOST,
  neo4jPort: process.env.NEO4J_PORT
};
