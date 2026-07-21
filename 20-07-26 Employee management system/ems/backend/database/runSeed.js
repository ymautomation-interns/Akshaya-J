/**
 * Utility script to initialize the database:
 * - Runs schema.sql (drops & recreates tables)
 * - Runs seed.sql (inserts sample roles & employees)
 *
 * Usage: npm run seed
 */
const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

const run = async () => {
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf-8');

    console.log('Running schema.sql ...');
    await pool.query(schemaSql);

    console.log('Running seed.sql ...');
    await pool.query(seedSql);

    console.log('✅ Database initialized and seeded successfully.');
  } catch (err) {
    console.error('❌ Failed to initialize database:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

run();
