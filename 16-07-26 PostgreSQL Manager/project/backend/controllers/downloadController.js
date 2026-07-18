// controllers/downloadController.js
// Handles GET /download/excel and GET /download/pdf.

const { getAllRecords, tableExists } = require('../services/dbService');
const { generateExcelBuffer } = require('../services/excelService');
const { generatePdfBuffer } = require('../services/pdfService');

async function downloadExcel(req, res, next) {
  try {
    const exists = await tableExists();
    const records = exists ? await getAllRecords() : [];

    const buffer = await generateExcelBuffer(records);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename="exported_data.xlsx"');
    return res.send(buffer);
  } catch (err) {
    next(err);
  }
}

async function downloadPdf(req, res, next) {
  try {
    const exists = await tableExists();
    const records = exists ? await getAllRecords() : [];

    const buffer = await generatePdfBuffer(records);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="exported_data.pdf"');
    return res.send(buffer);
  } catch (err) {
    next(err);
  }
}

module.exports = { downloadExcel, downloadPdf };
