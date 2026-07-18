// services/dbService.js
// Handles dynamic table creation and safe, parameterized data insertion.

const { pool } = require('../database/db');
const { quoteIdentifier } = require('../utils/sanitize');

const TABLE_NAME = 'excel_data';

/**
 * Ensure the target table exists with (at least) the given columns.
 * - Creates the table with an auto-increment id + TEXT columns if it doesn't exist.
 * - If the table already exists but is missing some columns (e.g. a new
 *   Excel file has extra headers), adds those columns on the fly.
 */
async function ensureTableExists(headers) {
  const client = await pool.connect();
  try {
    const tableIdent = quoteIdentifier(TABLE_NAME);

    // Create table with base columns if it doesn't exist yet
    const columnDefs = headers.map((h) => `${quoteIdentifier(h)} TEXT`).join(', ');
    await client.query(`
      CREATE TABLE IF NOT EXISTS ${tableIdent} (
        id SERIAL PRIMARY KEY,
        ${columnDefs},
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // If table already existed, make sure any *new* columns are added too
    const existingColsResult = await client.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = $1`,
      [TABLE_NAME]
    );
    const existingCols = new Set(existingColsResult.rows.map((r) => r.column_name));

    for (const header of headers) {
      if (!existingCols.has(header)) {
        await client.query(
          `ALTER TABLE ${tableIdent} ADD COLUMN IF NOT EXISTS ${quoteIdentifier(header)} TEXT;`
        );
      }
    }
  } finally {
    client.release();
  }
}

/**
 * Insert an array of row objects into the table using parameterized queries.
 * Uses a single multi-row INSERT wrapped in a transaction for performance & atomicity.
 * @returns {Promise<number>} number of records inserted
 */
async function insertRows(headers, rows) {
  if (rows.length === 0) return 0;

  const client = await pool.connect();
  const tableIdent = quoteIdentifier(TABLE_NAME);
  const columnList = headers.map(quoteIdentifier).join(', ');

  try {
    await client.query('BEGIN');

    let insertedCount = 0;
    const BATCH_SIZE = 500; // avoid exceeding PostgreSQL's parameter limit per query

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);

      const valuePlaceholders = [];
      const values = [];
      let paramIndex = 1;

      for (const row of batch) {
        const placeholders = headers.map(() => `$${paramIndex++}`);
        valuePlaceholders.push(`(${placeholders.join(', ')})`);
        headers.forEach((h) => values.push(row[h] ?? null));
      }

      const insertQuery = `
        INSERT INTO ${tableIdent} (${columnList})
        VALUES ${valuePlaceholders.join(', ')};
      `;

      const result = await client.query(insertQuery, values);
      insertedCount += result.rowCount;
    }

    await client.query('COMMIT');
    return insertedCount;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Fetch paginated records from the table.
 */
async function getRecords({ page = 1, limit = 10 } = {}) {
  const offset = (page - 1) * limit;

  const countResult = await pool.query(`SELECT COUNT(*) FROM ${quoteIdentifier(TABLE_NAME)};`);
  const totalRecords = parseInt(countResult.rows[0].count, 10);

  const dataResult = await pool.query(
    `SELECT * FROM ${quoteIdentifier(TABLE_NAME)} ORDER BY id ASC LIMIT $1 OFFSET $2;`,
    [limit, offset]
  );

  return {
    records: dataResult.rows,
    totalRecords,
    totalPages: Math.ceil(totalRecords / limit) || 1,
    currentPage: page,
  };
}

/**
 * Fetch ALL records (used for Excel/PDF export).
 */
async function getAllRecords() {
  const result = await pool.query(`SELECT * FROM ${quoteIdentifier(TABLE_NAME)} ORDER BY id ASC;`);
  return result.rows;
}

/**
 * Check whether the table currently exists (used to give a friendly
 * "no data yet" response instead of a DB error on a fresh install).
 */
async function tableExists() {
  const result = await pool.query(
    `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1);`,
    [TABLE_NAME]
  );
  return result.rows[0].exists;
}

module.exports = {
  TABLE_NAME,
  ensureTableExists,
  insertRows,
  getRecords,
  getAllRecords,
  tableExists,
};
