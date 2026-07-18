// routes/downloadRoutes.js
const express = require('express');
const router = express.Router();
const { downloadExcel, downloadPdf } = require('../controllers/downloadController');

// GET /download/excel - export all records as .xlsx
router.get('/download/excel', downloadExcel);

// GET /download/pdf - export all records as .pdf
router.get('/download/pdf', downloadPdf);

module.exports = router;
