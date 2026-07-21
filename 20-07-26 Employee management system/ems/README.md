# Employee Management System

A full-stack Employee Management System built with React (Vite + Tailwind) on the
frontend and Node.js/Express + PostgreSQL on the backend.

## Features

- Responsive dashboard with collapsible sidebar (Home, Employee Details, Roles, Attendance, Leave Details)
- Home page with summary cards (Total Employees, Total Roles, Active Employees)
- Roles management (CRUD) preloaded with 5 default roles
- Employee management (CRUD) with a dynamic **Reporting To** dropdown driven entirely
  by backend business logic based on the organizational hierarchy:

  ```
  Super Admin -> HR -> Manager -> Employee -> Intern
  ```

- **Attendance module**: employee cards -> tap to Check In / Break Start / Break End / Check Out,
  live HH:MM:SS timers driven by server timestamps, multiple breaks per day supported,
  full attendance history table
- Leave Details page is a placeholder (as specified)
- Fully responsive UI (desktop / tablet / mobile)

## Project Structure

```
ems/
├── backend/
│   ├── config/          # DB connection pool
│   ├── controllers/     # Route handlers / business logic
│   ├── database/        # schema.sql, seed.sql, runSeed.js
│   ├── middleware/       # Error handling
│   ├── models/           # SQL query layer
│   ├── routes/            # Express routers
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/   # Reusable UI: Sidebar, Navbar, Button, Input, Select, Card, Table, Modal, Alert, Loader
    │   ├── layouts/       # DashboardLayout
    │   ├── pages/         # Home, Employees, Roles, Attendance, LeaveDetails
    │   ├── services/      # Axios API layer
    │   └── utils/         # Constants (nav items)
    └── index.html
```

## Setup

### 1. Database

1. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE employee_management;
   ```
2. Copy `backend/.env.example` to `backend/.env` and fill in your PostgreSQL credentials.

### 2. Backend

```bash
cd backend
npm install
npm run seed                 # creates roles/employees tables + inserts sample data
npm run migrate:attendance   # creates attendance + attendance_breaks tables (non-destructive)
npm run dev                  # starts server on http://localhost:5000
```

`migrate:attendance` only runs `CREATE TABLE IF NOT EXISTS` — it's safe to run on a
database that already has roles/employees data; it will never drop or touch them.

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # optional: adjust VITE_API_URL if needed
npm run dev             # starts app on http://localhost:5173
```

## Reporting To Logic

The `/api/employees/reporting/:role` endpoint returns only the Employee IDs of the
role immediately above the given role in the hierarchy:

| Selected Role | Reporting To options come from |
|---|---|
| Super Admin | none (empty array — field hidden in UI) |
| HR | Super Admin |
| Manager | HR |
| Employee | Manager |
| Intern | Employee |

This logic is entirely server-side (see `models/roleModel.js` → `getParentRoleName`
and `controllers/employeeController.js` → `getReportingOptions`). The frontend simply
calls the API and renders whatever it receives — no hierarchy logic is hardcoded in React.

## Attendance Module

- `attendance` table: one row per employee per day (`employee_id`, `attendance_date` unique together)
- `attendance_breaks` table: one row per break, linked to an `attendance` row (supports unlimited breaks/day)
- All business rules (can't check out before check in, can't double break-start, etc.)
  are validated server-side in `controllers/attendanceController.js`
- Timers are computed from real timestamps (`check_in`, `break_start`, `break_end`) rather
  than pure frontend counters, so they stay accurate across refreshes — see
  `frontend/src/hooks/useAttendanceTimer.js`

Endpoints:
```
POST /api/attendance/checkin        { employee_id }
POST /api/attendance/break-start    { employee_id }
POST /api/attendance/break-end      { employee_id }
POST /api/attendance/checkout       { employee_id }
GET  /api/attendance                (full history, all employees)
GET  /api/attendance/today          (today's status for all employees)
GET  /api/attendance/:employeeId    (history for one employee)
```

## Sample Seed Data

10 employees are seeded (EMP001–EMP010) matching the hierarchy, so the Reporting To
dropdown has real data to test against immediately after seeding.

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router DOM, Axios, Lucide React
- **Backend:** Node.js, Express.js, node-postgres (`pg`)
- **Database:** PostgreSQL
