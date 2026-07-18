// controllers/dataController.js
// Handles GET /data: returns paginated records from PostgreSQL.

const { getRecords, tableExists } = require('../services/dbService');

async function getData(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 200);

    const exists = await tableExists();
    if (!exists) {
      return res.status(200).json({
        success: true,
        records: [],
        totalRecords: 0,
        totalPages: 1,
        currentPage: 1,
        message: 'No data uploaded yet.',
      });
    }

    const result = await getRecords({ page, limit });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getData };
