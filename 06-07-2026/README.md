# Admin & User Panel

A full-stack web application with Role-Based Access Control (RBAC) for student management. Features separate admin and user panels with secure authentication using Argon2id password hashing.

## Features

### Admin Panel
- Secure login with Argon2id password hashing
- Dashboard with student count statistics
- Complete CRUD operations for students:
  - Create new students
  - Read/View students (table and card views)
  - Update student information (editable form)
  - Delete students
- User management section
- Settings page with CRUD information

### User Panel
- Secure login
- Dashboard with student count statistics
- View-only access to students (table and card views)
- No editing or deletion permissions

### Security
- Argon2id password hashing
- Role-based access control (RBAC)
- Protected admin endpoints
- CORS enabled
- Input validation

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Security**: Argon2id password hashing
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **API**: RESTful API with JSON

## Prerequisites

- Node.js v14 or higher
- PostgreSQL v12 or higher
- npm (Node Package Manager)

## Installation

### 1. Clone or navigate to project directory

```bash
cd C:\Users\AKSHAYA\CascadeProjects\admin-user-panel
```

### 2. Install PostgreSQL (if not already installed)

Download and install PostgreSQL from: https://www.postgresql.org/download/windows/

### 3. Create Database

Open PostgreSQL command line tool (psql) and run:

```sql
CREATE DATABASE admin_user_panel;
```

### 4. Configure Environment Variables

Edit `backend/.env` file:

```env
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here
DB_HOST=localhost
DB_PORT=5432
DB_NAME=admin_user_panel
PORT=5000
ADMIN_PASSWORD=Admin@26
```

### 5. Install Dependencies

```bash
cd backend
npm install
```

### 6. Initialize Database

```bash
node init.js
```

This will create the necessary tables and seed default users.

### 7. Start Server

```bash
npm start
```

The server will start on http://localhost:5000

## Default Credentials

### Admin Account
- **Username**: root
- **Password**: Admin@26
- **Access**: Full CRUD operations

### User Account
- **Username**: user1
- **Password**: user123
- **Access**: View only (no editing/deletion)

## Access URLs

- **Login Page**: http://localhost:5000/index.html
- **Admin Panel**: http://localhost:5000/admin.html
- **User Panel**: http://localhost:5000/user.html

## Project Structure

```
admin-user-panel/
├── README.md
├── backend/
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   └── students.js       # Student CRUD routes
│   ├── db.js                 # Database configuration
│   ├── init.js               # Database initialization
│   ├── server.js             # Express server
│   ├── package.json          # Dependencies
│   └── .env                  # Environment variables
└── frontend/
    ├── index.html            # Login page
    ├── admin.html            # Admin dashboard
    ├── user.html             # User dashboard
    ├── admin.js              # Admin panel logic
    ├── user.js               # User panel logic
    └── styles.css            # Styling
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Students
- `GET /api/students` - Get all students (admin/user)
- `GET /api/students/:id` - Get single student (admin/user)
- `POST /api/students` - Create student (admin only)
- `PUT /api/students/:id` - Update student (admin only)
- `DELETE /api/students/:id` - Delete student (admin only)
- `GET /api/students/count/total` - Get student count (admin/user)

## Usage

### Admin Panel
1. Login with admin credentials
2. Navigate to Dashboard to view student count
3. Go to Students tab to view all students (table or card view)
4. Use Add Student tab to create new students
5. Edit or delete students from the Students tab
6. View Settings for CRUD information

### User Panel
1. Login with user credentials
2. Navigate to Dashboard to view student count
3. Go to Students tab to view all students (table or card view)
4. View-only access - no editing or deletion

## Testing with Postman

A Postman collection is available for API testing. Import `postman_collection.json` into Postman to test all endpoints.

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Verify credentials in `.env` file
- Confirm database exists

### Port Already in Use
- Change PORT in `.env` file to a different port

### Login Failure
- Verify correct username and password (case-sensitive)
- Ensure database has been initialized with `node init.js`
- Check `.env` configuration

## License

ISC

## Support

For detailed setup instructions, see:
- `QUICK_START.md` - Quick setup guide
- `WINDOWS_SETUP.md` - Windows-specific setup
- `API_DOCUMENTATION.md` - Complete API reference
