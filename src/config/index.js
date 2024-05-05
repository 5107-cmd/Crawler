const defaultConfig = require("./defaultConfig.json");

module.exports = {
    postgresHost: process.env.POSTGRES_HOST || defaultConfig.db.postgres.host,
    postgresPort: process.env.POSTGRES_PORT || defaultConfig.db.postgres.port,
    postgresUser: process.env.POSTGRES_USER || defaultConfig.db.postgres.user,
    postgresPassword: process.env.POSTGRES_PASSWORD || defaultConfig.db.postgres.password,
    postgresDatabase: process.env.POSTGRES_DATABASE || defaultConfig.db.postgres.database,
    port: process.env.PORT || defaultConfig.port
};
