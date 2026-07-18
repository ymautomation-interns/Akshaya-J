// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/uploadMiddleware');
const { uploadExcel } = require('../controllers/uploadController');

// POST /upload - upload Excel, parse, and save to PostgreSQL
router.post('/upload', upload.single('file'), uploadExcel);

module.exports = router;
