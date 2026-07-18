// utils/sanitize.js
// Helpers to turn arbitrary Excel header text into safe PostgreSQL identifiers.
// Column names can never be parameterized with placeholders ($1, $2 ...) in SQL,
// so we defend against SQL injection by strictly whitelisting characters instead.

/**
 * Convert a raw Excel header (e.g. "Employee Name", "E-Mail!") into a safe,
 * lowercase, snake_case SQL column name (e.g. "employee_name", "e_mail").
 */
function sanitizeColumnName(rawName, fallbackIndex = 0) {
  if (!rawName || typeof rawName !== 'string') {
    return `column_${fallbackIndex}`;
  }

  let name = rawName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_') // replace any non-alphanumeric char with underscore
    .replace(/^_+|_+$/g, '') // trim leading/trailing underscores
    .replace(/_{2,}/g, '_'); // collapse multiple underscores

  if (!name) name = `column_${fallbackIndex}`;
  if (/^[0-9]/.test(name)) name = `col_${name}`; // identifiers can't start with a digit

  // Avoid reserved word collisions with our own metadata columns
  const reserved = ['id', 'created_at'];
  if (reserved.includes(name)) name = `${name}_field`;

  return name;
}

/**
 * Sanitize an array of raw headers, ensuring uniqueness (append _2, _3, ... on collision).
 */
function sanitizeHeaders(headers) {
  const seen = new Map();
  return headers.map((h, idx) => {
    let name = sanitizeColumnName(h, idx);
    if (seen.has(name)) {
      const count = seen.get(name) + 1;
      seen.set(name, count);
      name = `${name}_${count}`;
    } else {
      seen.set(name, 1);
    }
    return name;
  });
}

/**
 * Safely quote an identifier for use in a raw SQL string (table/column names
 * cannot be passed as query parameters). We already restrict sanitized names
 * to [a-z0-9_], so this is just an extra defensive layer.
 */
function quoteIdentifier(name) {
  if (!/^[a-z0-9_]+$/.test(name)) {
    throw new Error(`Unsafe identifier rejected: ${name}`);
  }
  return `"${name}"`;
}

module.exports = { sanitizeColumnName, sanitizeHeaders, quoteIdentifier };
