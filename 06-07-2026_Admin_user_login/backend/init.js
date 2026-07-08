const argon2 = require('argon2');
const { pool } = require('./db');

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS students (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      phone VARCHAR(30),
      department VARCHAR(100),
      course VARCHAR(100),
      age INT,
      address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const adminPassword = await argon2.hash(process.env.ADMIN_PASSWORD || 'Admin@26');
  await pool.query(
    `INSERT INTO users (username, password_hash, role)
     VALUES ($1, $2, $3)
     ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role;`,
    ['root', adminPassword, 'admin']
  );

  const samplePassword = await argon2.hash('user123');
  await pool.query(
    `INSERT INTO users (username, password_hash, role)
     VALUES ($1, $2, $3)
     ON CONFLICT (username) DO NOTHING;`,
    ['user1', samplePassword, 'user']
  );

  console.log('Database initialization complete.');
  console.log('Admin user: root / Admin@26');
  console.log('Sample user: user1 / user123');
}

initializeDatabase()
  .then(() => pool.end())
  .catch((error) => {
    console.error('Database initialization failed:', error);
    process.exit(1);
  });
