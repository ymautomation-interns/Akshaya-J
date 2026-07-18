// middleware/errorHandler.js
// Centralized error handler. Catches errors thrown/passed via next(err) from
// any controller or middleware (including Multer file-filter errors) and
// returns a consistent JSON error response.

const multer = require('multer');

function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);

  // Multer-specific errors (file too large, unexpected field, etc.)
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`,
    });
  }

  // Invalid file type thrown from our fileFilter
  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({ success: false, message: err.message });
  }

  // PostgreSQL connection errors
  if (err.code === 'ECONNREFUSED' || err.code === '3D000') {
    return res.status(503).json({
      success: false,
      message: 'Database connection error. Please try again later.',
    });
  }

  // Duplicate record (unique constraint violation)
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'Duplicate record detected. Some rows were not inserted.',
    });
  }

  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
  });
}

module.exports = errorHandler;
