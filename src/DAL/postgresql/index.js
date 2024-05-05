const {Client} = require('pg');
const {postgresUser, postgresPassword, postgresHost, postgresPort, postgresDatabase} = require("../../config");

const connectionString = `postgres://${postgresUser}:${postgresPassword}@${postgresHost}:${postgresPort}/${postgresDatabase}`;

const connectionStringWithTimeout = `${connectionString}?connect_timeout=500`;


const pgClient = new Client({
    connectionString: connectionStringWithTimeout,
});

pgClient.connect()
    .then(() => {
        console.log('Connected to Super_base PostgresSQL database');
    })
    .catch((error) => {
        console.error('Error connecting to Super_base PostgresSQL database:', error);
    });


module.exports = pgClient;