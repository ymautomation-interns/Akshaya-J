# API Documentation

Complete API reference for the Admin & User Panel application.

## Base URL

```
http://localhost:5000/api
```

## Authentication

The API uses role-based access control (RBAC). Include the user role in the request header:

```
x-user-role: admin
```

or

```
x-user-role: user
```

## Endpoints

### Authentication

#### Login
Authenticate a user and receive user information.

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "username": "root",
  "password": "Admin@26"
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "username": "root",
  "role": "admin"
}
```

**Error Response** (401 Unauthorized):
```json
{
  "error": "Invalid credentials"
}
```

**Error Response** (400 Bad Request):
```json
{
  "error": "Username and password are required"
}
```

---

### Students

#### Get All Students
Retrieve all students from the database.

**Endpoint**: `GET /api/students`

**Headers**:
```
x-user-role: admin
```
or
```
x-user-role: user
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "department": "Computer Science",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

**Error Response** (403 Forbidden):
```json
{
  "error": "Access denied"
}
```

---

#### Get Single Student
Retrieve a specific student by ID.

**Endpoint**: `GET /api/students/:id`

**Headers**:
```
x-user-role: admin
```
or
```
x-user-role: user
```

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "department": "Computer Science",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

**Error Response** (404 Not Found):
```json
{
  "error": "Student not found"
}
```

---

#### Create Student
Create a new student (Admin only).

**Endpoint**: `POST /api/students`

**Headers**:
```
x-user-role: admin
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+0987654321",
  "department": "Engineering"
}
```

**Response** (201 Created):
```json
{
  "id": 2,
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+0987654321",
  "department": "Engineering",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

**Error Response** (400 Bad Request):
```json
{
  "error": "Name and email are required"
}
```

**Error Response** (400 Bad Request - Duplicate Email):
```json
{
  "error": "Email already exists"
}
```

**Error Response** (403 Forbidden):
```json
{
  "error": "Access denied"
}
```

---

#### Update Student
Update an existing student (Admin only).

**Endpoint**: `PUT /api/students/:id`

**Headers**:
```
x-user-role: admin
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Jane Smith Updated",
  "email": "jane.updated@example.com",
  "phone": "+1111111111",
  "department": "Computer Engineering"
}
```

**Response** (200 OK):
```json
{
  "id": 2,
  "name": "Jane Smith Updated",
  "email": "jane.updated@example.com",
  "phone": "+1111111111",
  "department": "Computer Engineering",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T12:00:00.000Z"
}
```

**Error Response** (404 Not Found):
```json
{
  "error": "Student not found"
}
```

**Error Response** (400 Bad Request - Duplicate Email):
```json
{
  "error": "Email already exists"
}
```

**Error Response** (403 Forbidden):
```json
{
  "error": "Access denied"
}
```

---

#### Delete Student
Delete a student (Admin only).

**Endpoint**: `DELETE /api/students/:id`

**Headers**:
```
x-user-role: admin
```

**Response** (200 OK):
```json
{
  "message": "Student deleted successfully"
}
```

**Error Response** (404 Not Found):
```json
{
  "error": "Student not found"
}
```

**Error Response** (403 Forbidden):
```json
{
  "error": "Access denied"
}
```

---

#### Get Student Count
Get the total number of students.

**Endpoint**: `GET /api/students/count/total`

**Headers**:
```
x-user-role: admin
```
or
```
x-user-role: user
```

**Response** (200 OK):
```json
{
  "count": 10
}
```

**Error Response** (403 Forbidden):
```json
{
  "error": "Access denied"
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Students Table
```sql
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  department VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Testing with Postman

1. Import `postman_collection.json` into Postman
2. Test the Login endpoint first to get user info
3. Use the returned role in subsequent requests
4. Add `x-user-role` header to all student endpoints

## Security Notes

- All passwords are hashed using Argon2id
- Role-based access control is enforced on all endpoints
- Input validation is performed on all requests
- CORS is enabled for cross-origin requests
