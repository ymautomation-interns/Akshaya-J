# Excel &rarr; PostgreSQL Manager

A full-stack app to upload Excel files, store the data in PostgreSQL, view it
in a paginated Bootstrap table, and export it back out as Excel or PDF.

**Stack:** React (Vite) + Bootstrap 5 + Axios | Node.js + Express + PostgreSQL + Multer + ExcelJS + PDFKit

## Folder Structure

```
project/
├── backend/
│   ├── controllers/       # request handlers (upload, data, download)
│   ├── routes/             # Express route definitions
│   ├── middleware/         # Multer config + centralized error handler
│   ├── services/           # Excel parsing/export, PDF generation, DB logic
│   ├── database/           # PostgreSQL connection pool + schema.sql
│   ├── utils/               # column-name sanitization helpers
│   ├── uploads/             # temp storage for uploaded files (auto-cleaned)
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/     # FileUpload, DataTable, Pagination
│       ├── services/       # api.js (Axios wrapper)
│       └── App.jsx
├── sample_data.xlsx        # sample file to try the upload feature
└── README.md
```

## Prerequisites

- Node.js 18+
- PostgreSQL 13+ running locally (or a connection string to a remote instance)

## 1. Database Setup

Create the database (the table itself is created **automatically** by the
backend the first time you upload a file — no manual schema step required):

```bash
psql -U postgres -c "CREATE DATABASE excel_data_db;"
```

`backend/database/schema.sql` is included as a reference of what the
auto-generated table looks like for the sample file, in case you want to
inspect it or create it manually.

## 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials
npm run dev        # starts with nodemon on http://localhost:5000
# or: npm start
```

`.env` variables:

```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=excel_data_db
DB_USER=postgres
DB_PASSWORD=postgres
FRONTEND_ORIGIN=http://localhost:5173
```

## 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit VITE_API_BASE_URL if your backend isn't on localhost:5000
npm run dev         # starts Vite dev server on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

## 4. Try It Out

1. Use the included `sample_data.xlsx` (columns: name, email, department, salary).
2. Drag it into the upload box (or click to browse) and hit **Upload & Save to Database**.
3. The table below refreshes automatically and shows paginated results.
4. Click **Download Excel** or **Download PDF** to export everything currently in PostgreSQL.

## API Endpoints

| Method | Endpoint          | Description                                   |
|--------|-------------------|------------------------------------------------|
| POST   | `/upload`         | Upload an Excel file, parse it, save to DB     |
| GET    | `/data?page=&limit=` | Fetch paginated records                     |
| GET    | `/download/excel` | Download all records as `exported_data.xlsx`  |
| GET    | `/download/pdf`   | Download all records as `exported_data.pdf`    |

## How Table Creation Works

The backend reads the header row of the uploaded Excel file, sanitizes each
header into a safe `snake_case` SQL identifier (e.g. `"Employee Email"` →
`employee_email`), then:

- Creates the `excel_data` table if it doesn't exist, with those columns as `TEXT`.
- If the table already exists but a new upload has extra columns, it adds
  those columns with `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`.
- All row values are inserted using parameterized queries (`$1, $2, ...`) —
  never string-concatenated — to prevent SQL injection.

## Error Handling Covered

- Rejects non-`.xlsx`/`.xls` files (both by extension and MIME type) before they're saved.
- Rejects empty Excel files or files with headers but no data rows.
- Centralized Express error handler returns friendly JSON for: invalid files,
  Multer errors (size limits, etc.), PostgreSQL connection failures, and
  unique-constraint (duplicate) violations.
- Uploaded temp files are always deleted after processing, success or failure.

## Notes / Possible Extensions

- To enforce true duplicate detection, add a `UNIQUE` constraint on a
  meaningful column (e.g. email) — see the commented-out example in
  `backend/database/schema.sql` — and the error handler will already
  surface a friendly "duplicate record" message for it.
- For very large files, consider streaming the Excel parse instead of
  loading the whole workbook into memory.
