// server.js
// Main entry point: sets up Express app, middleware, routes, and starts the server.

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { testConnection } = require('./database/db');
const uploadRoutes = require('./routes/uploadRoutes');
const dataRoutes = require('./routes/dataRoutes');
const downloadRoutes = require('./routes/downloadRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Global middleware ---
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Health check ---
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Excel-Postgres API is running' });
});

// --- API routes ---
app.use('/', uploadRoutes);
app.use('/', dataRoutes);
app.use('/', downloadRoutes);

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// --- Centralized error handler (must be last) ---
app.use(errorHandler);

// --- Start server after verifying DB connection ---
async function start() {
  try {
    await testConnection();
  } catch (err) {
    console.error('Starting server without a verified DB connection. Fix DB config and restart.');
  }
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

start();
