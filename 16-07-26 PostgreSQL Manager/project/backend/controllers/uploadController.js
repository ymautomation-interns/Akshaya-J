// controllers/uploadController.js
// Handles POST /upload: validates the file, parses it, and saves rows to PostgreSQL.

const fs = require('fs');
const { parseExcelFile } = require('../services/excelService');
const { ensureTableExists, insertRows } = require('../services/dbService');

async function uploadExcel(req, res, next) {
  let filePath;
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please attach a .xlsx or .xls file.',
      });
    }

    filePath = req.file.path;

    // 1. Parse the Excel file into headers + row objects
    const { headers, rows } = await parseExcelFile(filePath);

    // 2. Ensure the PostgreSQL table exists (create/alter as needed)
    await ensureTableExists(headers);

    // 3. Insert rows using parameterized queries
    const insertedCount = await insertRows(headers, rows);

    return res.status(201).json({
      success: true,
      message: 'File uploaded and data saved successfully.',
      recordsInserted: insertedCount,
      columns: headers,
    });
  } catch (err) {
    next(err);
  } finally {
    // Clean up the temporary uploaded file regardless of success/failure
    if (filePath && fs.existsSync(filePath)) {
      fs.unlink(filePath, () => {});
    }
  }
}

module.exports = { uploadExcel };
