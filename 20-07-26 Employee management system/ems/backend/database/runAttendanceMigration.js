/**
 * Runs ONLY the attendance schema (CREATE TABLE IF NOT EXISTS).
 * This does NOT drop or touch your existing roles/employees tables or data.
 *
 * Usage: npm run migrate:attendance
 */
const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

const run = async () => {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'attendance_schema.sql'), 'utf-8');
    console.log('Running attendance_schema.sql ...');
    await pool.query(sql);
    console.log('✅ Attendance tables are ready (existing data untouched).');
  } catch (err) {
    console.error('❌ Failed to create attendance tables:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

run();
