-- schema.sql
-- Reference schema for the sample Excel file (name, email, department, salary).
-- NOTE: In this application the table is actually created AUTOMATICALLY at
-- runtime by backend/services/dbService.js, based on whatever column headers
-- are found in the uploaded Excel file. This file is provided only as a
-- reference / for manual setup if you want to pre-create the table yourself.

CREATE TABLE IF NOT EXISTS excel_data (
    id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT,
    department TEXT,
    salary TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Optional: unique constraint to help prevent exact duplicate rows
-- (uncomment and adjust columns as needed for your real data)
-- ALTER TABLE excel_data ADD CONSTRAINT unique_email UNIQUE (email);
