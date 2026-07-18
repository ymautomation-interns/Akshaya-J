// services/excelService.js
// Reads an uploaded .xlsx/.xls file and converts it into a clean JSON structure:
// { headers: string[], rows: object[] }
// The first row of the sheet is treated as the header row.

const ExcelJS = require('exceljs');
const { sanitizeHeaders } = require('../utils/sanitize');

/**
 * Parse an Excel file from disk into headers + row objects.
 * @param {string} filePath - path to the uploaded file on disk
 * @returns {Promise<{headers: string[], rows: object[]}>}
 */
async function parseExcelFile(filePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.worksheets[0];
  if (!worksheet || worksheet.rowCount === 0) {
    const err = new Error('The uploaded Excel file is empty.');
    err.statusCode = 400;
    throw err;
  }

  // --- Extract & sanitize header row ---
  const headerRow = worksheet.getRow(1);
  const rawHeaders = [];
  headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    rawHeaders[colNumber - 1] = cell.value ? String(cell.value).trim() : '';
  });

  if (rawHeaders.length === 0 || rawHeaders.every((h) => !h)) {
    const err = new Error('No header row found in the Excel file.');
    err.statusCode = 400;
    throw err;
  }

  const headers = sanitizeHeaders(rawHeaders);

  // --- Extract data rows ---
  const rows = [];
  for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
    const row = worksheet.getRow(rowNumber);
    if (row.cellCount === 0 || row.values.length === 0) continue; // skip blank rows

    const rowObj = {};
    let hasData = false;

    headers.forEach((header, idx) => {
      const cell = row.getCell(idx + 1);
      let value = cell.value;

      // Normalize ExcelJS special cell value types (dates, formulas, rich text)
      if (value && typeof value === 'object') {
        if (value.text) value = value.text; // rich text
        else if (value.result !== undefined) value = value.result; // formula result
        else if (value instanceof Date) value = value.toISOString();
        else value = JSON.stringify(value);
      }

      if (value !== null && value !== undefined && value !== '') hasData = true;
      rowObj[header] = value !== undefined && value !== null ? String(value) : null;
    });

    if (hasData) rows.push(rowObj);
  }

  if (rows.length === 0) {
    const err = new Error('The Excel file has headers but no data rows.');
    err.statusCode = 400;
    throw err;
  }

  return { headers, rows };
}

/**
 * Build an in-memory .xlsx file (Buffer) from an array of DB record objects.
 */
async function generateExcelBuffer(records) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Exported Data');

  if (records.length === 0) {
    worksheet.addRow(['No data available']);
    return workbook.xlsx.writeBuffer();
  }

  const columns = Object.keys(records[0]);
  worksheet.columns = columns.map((col) => ({
    header: col.toUpperCase(),
    key: col,
    width: Math.max(15, col.length + 5),
  }));

  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD9E1F2' },
  };

  records.forEach((record) => worksheet.addRow(record));

  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  });

  return workbook.xlsx.writeBuffer();
}

module.exports = { parseExcelFile, generateExcelBuffer };
