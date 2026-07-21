-- ============================================
-- Employee Management System - Seed Data
-- ============================================

-- ROLES (hierarchy order matters: 1 = highest)
INSERT INTO roles (role_name, description) VALUES
  ('Super Admin', 'Highest authority, reports to no one'),
  ('HR', 'Human Resources, reports to Super Admin'),
  ('Manager', 'Team Manager, reports to HR'),
  ('Employee', 'Regular Employee, reports to Manager'),
  ('Intern', 'Intern, reports to Employee');

-- EMPLOYEES
-- EMP001 - Super Admin (reports to no one)
INSERT INTO employees (employee_id, employee_name, role_id, reporting_to)
VALUES ('EMP001', 'Alexander Grant', (SELECT role_id FROM roles WHERE role_name = 'Super Admin'), NULL);

-- EMP002, EMP003 - HR (report to EMP001)
INSERT INTO employees (employee_id, employee_name, role_id, reporting_to)
VALUES ('EMP002', 'Priya Nair', (SELECT role_id FROM roles WHERE role_name = 'HR'),
        (SELECT id FROM employees WHERE employee_id = 'EMP001'));

INSERT INTO employees (employee_id, employee_name, role_id, reporting_to)
VALUES ('EMP003', 'Daniel Cho', (SELECT role_id FROM roles WHERE role_name = 'HR'),
        (SELECT id FROM employees WHERE employee_id = 'EMP001'));

-- EMP004, EMP005 - Manager (report to HR)
INSERT INTO employees (employee_id, employee_name, role_id, reporting_to)
VALUES ('EMP004', 'Meera Iyer', (SELECT role_id FROM roles WHERE role_name = 'Manager'),
        (SELECT id FROM employees WHERE employee_id = 'EMP002'));

INSERT INTO employees (employee_id, employee_name, role_id, reporting_to)
VALUES ('EMP005', 'Thomas Reyes', (SELECT role_id FROM roles WHERE role_name = 'Manager'),
        (SELECT id FROM employees WHERE employee_id = 'EMP003'));

-- EMP006, EMP007, EMP008 - Employee (report to Manager)
INSERT INTO employees (employee_id, employee_name, role_id, reporting_to)
VALUES ('EMP006', 'Sara Ahmed', (SELECT role_id FROM roles WHERE role_name = 'Employee'),
        (SELECT id FROM employees WHERE employee_id = 'EMP004'));

INSERT INTO employees (employee_id, employee_name, role_id, reporting_to)
VALUES ('EMP007', 'Vikram Rao', (SELECT role_id FROM roles WHERE role_name = 'Employee'),
        (SELECT id FROM employees WHERE employee_id = 'EMP004'));

INSERT INTO employees (employee_id, employee_name, role_id, reporting_to)
VALUES ('EMP008', 'Lucas Brown', (SELECT role_id FROM roles WHERE role_name = 'Employee'),
        (SELECT id FROM employees WHERE employee_id = 'EMP005'));

-- EMP009, EMP010 - Intern (report to Employee)
INSERT INTO employees (employee_id, employee_name, role_id, reporting_to)
VALUES ('EMP009', 'Ananya Singh', (SELECT role_id FROM roles WHERE role_name = 'Intern'),
        (SELECT id FROM employees WHERE employee_id = 'EMP006'));

INSERT INTO employees (employee_id, employee_name, role_id, reporting_to)
VALUES ('EMP010', 'Noah Wilson', (SELECT role_id FROM roles WHERE role_name = 'Intern'),
        (SELECT id FROM employees WHERE employee_id = 'EMP007'));
