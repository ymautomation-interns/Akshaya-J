// routes/dataRoutes.js
const express = require('express');
const router = express.Router();
const { getData } = require('../controllers/dataController');

// GET /data?page=1&limit=10 - fetch paginated records
router.get('/data', getData);

module.exports = router;
