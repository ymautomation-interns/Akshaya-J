-- ============================================
-- Attendance Module - Schema (additive/non-destructive)
-- Safe to run on an existing database - does NOT touch
-- the existing roles / employees tables or their data.
-- ============================================

CREATE TABLE IF NOT EXISTS attendance (
    attendance_id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
    check_in TIMESTAMP,
    check_out TIMESTAMP,
    total_working_seconds INTEGER DEFAULT 0,
    total_break_seconds INTEGER DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'checked_in'
        CHECK (status IN ('checked_in', 'on_break', 'checked_out')),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (employee_id, attendance_date)
);

CREATE TABLE IF NOT EXISTS attendance_breaks (
    break_id SERIAL PRIMARY KEY,
    attendance_id INTEGER NOT NULL REFERENCES attendance(attendance_id) ON DELETE CASCADE,
    break_start TIMESTAMP NOT NULL,
    break_end TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_attendance_employee_id ON attendance(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(attendance_date);
CREATE INDEX IF NOT EXISTS idx_attendance_breaks_attendance_id ON attendance_breaks(attendance_id);
