const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'admin.html'));
});

app.get('/user.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'user.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Admin panel: http://localhost:${port}/admin.html`);
  console.log(`User panel: http://localhost:${port}/user.html`);
});
