// services/pdfService.js
// Generates a PDF report (title, date/time, total records, bordered table)
// from an array of DB record objects, using PDFKit. Returns a Buffer.

const PDFDocument = require('pdfkit');

const PAGE_MARGIN = 40;
const ROW_HEIGHT = 22;
const FONT_SIZE = 9;

function generatePdfBuffer(records) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: PAGE_MARGIN, size: 'A4', layout: 'landscape' });
      const buffers = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // ---------- Header ----------
      doc.fontSize(18).font('Helvetica-Bold').text('Exported Data Report', { align: 'center' });
      doc.moveDown(0.5);

      doc.fontSize(10).font('Helvetica');
      doc.text(`Date & Time: ${new Date().toLocaleString()}`);
      doc.text(`Total Records: ${records.length}`);
      doc.moveDown(1);

      if (records.length === 0) {
        doc.fontSize(12).text('No data available.', { align: 'center' });
        doc.end();
        return;
      }

      // ---------- Table ----------
      const columns = Object.keys(records[0]);
      const tableWidth = doc.page.width - PAGE_MARGIN * 2;
      const colWidth = tableWidth / columns.length;

      let y = doc.y;

      const drawRow = (rowData, isHeader = false) => {
        // Page break check
        if (y + ROW_HEIGHT > doc.page.height - PAGE_MARGIN) {
          doc.addPage();
          y = PAGE_MARGIN;
        }

        let x = PAGE_MARGIN;
        doc.font(isHeader ? 'Helvetica-Bold' : 'Helvetica').fontSize(FONT_SIZE);

        columns.forEach((col, i) => {
          const cellValue = rowData[i] !== null && rowData[i] !== undefined ? String(rowData[i]) : '';

          if (isHeader) {
            doc.rect(x, y, colWidth, ROW_HEIGHT).fillAndStroke('#D9E1F2', '#999999');
            doc.fillColor('#000000');
          } else {
            doc.rect(x, y, colWidth, ROW_HEIGHT).stroke('#999999');
          }

          doc.text(cellValue, x + 4, y + 6, {
            width: colWidth - 8,
            height: ROW_HEIGHT - 4,
            ellipsis: true,
          });

          x += colWidth;
        });

        y += ROW_HEIGHT;
      };

      // Header row
      drawRow(columns.map((c) => c.toUpperCase()), true);

      // Data rows
      records.forEach((record) => {
        const rowValues = columns.map((col) => record[col]);
        drawRow(rowValues, false);
      });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generatePdfBuffer };
