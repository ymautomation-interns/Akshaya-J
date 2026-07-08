const express = require('express');
const argon2 = require('argon2');
const { pool } = require('../db');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isValid = await argon2.verify(user.password_hash, password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Login failed.' });
  }
});

module.exports = router;
