const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "college",
  password: "AKSHU@1213",
  port: 5432,
});

module.exports = pool;