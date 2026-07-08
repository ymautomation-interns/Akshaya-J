const express = require('express');
const { pool } = require('../db');

const router = express.Router();

function requireRole(role) {
  return (req, res, next) => {
    const userRole = req.headers['x-user-role'];
    if (userRole !== role) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch students.' });
  }
});

router.get('/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*)::int AS count FROM students');
    res.json({ count: result.rows[0].count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to count students.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch student.' });
  }
});

router.post('/', requireRole('admin'), async (req, res) => {
  const { name, email, phone, department, course, age, address } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO students (name, email, phone, department, course, age, address)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
      [name, email, phone || '', department || '', course || '', age ? Number(age) : null, address || '']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create student.' });
  }
});

router.put('/:id', requireRole('admin'), async (req, res) => {
  const { name, email, phone, department, course, age, address } = req.body;
  try {
    const result = await pool.query(
      `UPDATE students SET name=$1, email=$2, phone=$3, department=$4, course=$5, age=$6, address=$7
       WHERE id=$8 RETURNING *;`,
      [name, email, phone || '', department || '', course || '', age ? Number(age) : null, address || '', req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update student.' });
  }
});

router.delete('/:id', requireRole('admin'), async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM students WHERE id=$1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found.' });
    }
    res.json({ success: true, deleted: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete student.' });
  }
});

module.exports = router;
