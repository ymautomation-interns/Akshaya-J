# Windows Setup Guide

Detailed setup instructions for Windows users.

## Prerequisites Installation

### 1. Install Node.js

1. Download Node.js from: https://nodejs.org/
2. Download the LTS version (recommended)
3. Run the installer
4. Follow the installation wizard
5. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### 2. Install PostgreSQL

1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Download the latest version
3. Run the installer
4. Choose installation directory (default is fine)
5. Set a password for the postgres superuser (remember this!)
6. Choose port 5432 (default)
7. Complete the installation
8. Verify installation:
   ```bash
   psql --version
   ```

## Project Setup

### 1. Navigate to Project Directory

```bash
cd C:\Users\AKSHAYA\CascadeProjects\admin-user-panel
```

### 2. Create Database

Open Command Prompt or PowerShell and run:

```bash
psql -U postgres
```

Enter your postgres password when prompted.

Then run:
```sql
CREATE DATABASE admin_user_panel;
\q
```

### 3. Configure Environment Variables

Open `backend\.env` file in a text editor and update:

```env
DB_USER=postgres
DB_PASSWORD=your_actual_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=admin_user_panel
PORT=5000
ADMIN_PASSWORD=Admin@26
```

**Important**: Replace `your_actual_postgres_password` with the password you set during PostgreSQL installation.

### 4. Install Node Dependencies

```bash
cd backend
npm install
```

This will install:
- express
- pg
- argon2
- cors
- dotenv
- body-parser

### 5. Initialize Database

```bash
node init.js
```

This script will:
- Create users table
- Create students table
- Create root admin user (password: Admin@26)
- Create sample user1 (password: user123)

### 6. Start the Server

```bash
npm start
```

You should see:
```
Server running on http://localhost:5000
Admin panel: http://localhost:5000/admin.html
User panel: http://localhost:5000/user.html
```

## Accessing the Application

### Using Browser

1. Open your web browser
2. Navigate to: http://localhost:5000/index.html
3. Login with admin credentials:
   - Username: root
   - Password: Admin@26

### Using Postman (Optional)

1. Download Postman from: https://www.postman.com/downloads/
2. Import `postman_collection.json` from the project root
3. Test the API endpoints

## Windows-Specific Troubleshooting

### Issue: psql command not found

**Solution**: Add PostgreSQL bin directory to PATH
1. Search for "Environment Variables" in Windows
2. Click "Edit the system environment variables"
3. Click "Environment Variables"
4. Under "System variables", find "Path" and click "Edit"
5. Add PostgreSQL bin directory (usually: `C:\Program Files\PostgreSQL\15\bin`)
6. Restart Command Prompt/PowerShell

### Issue: Port 5000 already in use

**Solution**: Change port in `.env` file
```env
PORT=5001
```

### Issue: PostgreSQL service not running

**Solution**: Start PostgreSQL service
1. Open Services (Win+R, type `services.msc`)
2. Find "postgresql-x64-15" (version may vary)
3. Right-click and select "Start"

### Issue: Firewall blocking connection

**Solution**: Allow Node.js through firewall
1. Open Windows Defender Firewall
2. Allow Node.js through both private and public networks
3. Or temporarily disable firewall for testing

## Running as Background Service (Optional)

To keep the server running in the background:

### Using PowerShell
```bash
Start-Process node -ArgumentList "server.js" -WorkingDirectory "C:\Users\AKSHAYA\CascadeProjects\admin-user-panel\backend" -WindowStyle Hidden
```

### Using PM2 (Recommended)
```bash
npm install -g pm2
cd backend
pm2 start server.js --name admin-panel
pm2 save
pm2 startup
```

## Stopping the Server

Press `Ctrl+C` in the terminal where the server is running.

If using PM2:
```bash
pm2 stop admin-panel
pm2 delete admin-panel
```

## Uninstallation

To remove the project:
1. Stop the server
2. Delete the project directory
3. Optionally drop the database:
   ```bash
   psql -U postgres
   DROP DATABASE admin_user_panel;
   \q
   ```

## Support

For additional help:
- Check `README.md` for general documentation
- See `API_DOCUMENTATION.md` for API details
- Review `QUICK_START.md` for quick setup
