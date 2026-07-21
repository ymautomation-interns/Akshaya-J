-- ============================================
-- Employee Management System - Schema
-- ============================================

DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- ROLES TABLE
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- EMPLOYEES TABLE
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    employee_name VARCHAR(150) NOT NULL,
    role_id INTEGER NOT NULL REFERENCES roles(role_id) ON DELETE RESTRICT,
    reporting_to INTEGER REFERENCES employees(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_employees_role_id ON employees(role_id);
CREATE INDEX idx_employees_reporting_to ON employees(reporting_to);
