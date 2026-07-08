# Quick Start Guide

Get the Admin & User Panel up and running in minutes.

## Prerequisites Check

- [ ] Node.js installed (v14+)
- [ ] PostgreSQL installed (v12+)
- [ ] npm available

## Step 1: Database Setup

### Create Database
```bash
psql -U postgres
CREATE DATABASE admin_user_panel;
\q
```

## Step 2: Configure Environment

Edit `backend/.env`:
```env
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=admin_user_panel
PORT=5000
ADMIN_PASSWORD=Admin@26
```

## Step 3: Install Dependencies

```bash
cd backend
npm install
```

## Step 4: Initialize Database

```bash
node init.js
```

Expected output:
```
Creating tables...
Tables created successfully!
Root admin user created successfully!
Username: root
Password: Admin@26
Role: admin
Sample user1 created with password: user123
Database initialization complete!
```

## Step 5: Start Server

```bash
npm start
```

Server will start on http://localhost:5000

## Step 6: Access Application

### Login
URL: http://localhost:5000/index.html

### Admin Panel
- URL: http://localhost:5000/admin.html
- Username: root
- Password: Admin@26

### User Panel
- URL: http://localhost:5000/user.html
- Username: user1
- Password: user123

## Quick Test

1. Login as admin (root/Admin@26)
2. Go to "Add Student" tab
3. Create a test student
4. Go to "Students" tab
5. View in table and card views
6. Edit or delete the student
7. Check dashboard for updated count

## Common Issues

**"Cannot connect to database"**
- Check PostgreSQL is running
- Verify `.env` credentials
- Ensure database exists

**"Port 5000 already in use"**
- Change PORT in `.env` to 5001

**"Login fails"**
- Check username/password (case-sensitive)
- Run `node init.js` to seed users
- Verify `.env` configuration

## Next Steps

- Read full documentation in `README.md`
- Check `API_DOCUMENTATION.md` for API details
- Import `postman_collection.json` for API testing
