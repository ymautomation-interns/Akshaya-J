// database/db.js
// Sets up and exports a single shared PostgreSQL connection pool.

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'excel_data_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

// Fail fast with a clear message if the DB is unreachable
pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err.message);
});

/**
 * Simple helper to test the DB connection at server startup.
 */
async function testConnection() {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('✅ PostgreSQL connected successfully');
  } catch (err) {
    console.error('❌ PostgreSQL connection failed:', err.message);
    throw err;
  }
}

module.exports = { pool, testConnection };
