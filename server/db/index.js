const { Client } = require("pg");
require("dotenv").config();

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: {
    rejectUnauthorized: true
  }
})

client
  .connect()
  .then(() => console.log('Connected to PostgreSQL!'))
  .catch((err) => console.error('Connection error', err.stack))

module.exports = client;