# Employee QR Generator

A frontend-only enterprise tool that turns an Employee ID into a scannable QR
code, and that QR code opens that employee's profile — on any phone on the
same network. Built with React + Vite. No backend, database, or
localStorage: every employee record lives in a single static JSON file.

## Workflow

1. Enter an Employee ID (e.g. `EMP001`) on the home screen.
2. Click **Generate QR**.
3. A QR code is generated, encoding `${BASE_URL}/employee/EMP001`.
4. Scan it with a phone's camera.
5. The phone opens that URL and lands on `/employee/EMP001`.
6. React reads `EMP001` via `useParams()`, looks it up in `employees.json`,
   and shows that employee's profile — and nothing else.

## Getting started

```bash
npm install
npm run dev
```

Vite will print both a `Local` and a `Network` URL. The `Network` URL is what
your phone needs (they must be on the same Wi-Fi).

## Making QR codes scannable from your phone

QR codes are only useful if a phone can actually reach the URL they encode.
Since there's no backend, that URL has to be **your laptop's LAN IP**, not
`localhost`.

1. Find your local IP address:
   - **Windows:** `ipconfig` → look for "IPv4 Address"
   - **macOS:** `ipconfig getifaddr en0`
   - **Linux:** `hostname -I`
2. Open `src/config/appConfig.js` and set `BASE_URL` to that IP + port 5173:
   ```js
   export const BASE_URL = 'http://192.168.1.15:5173';
   ```
3. Run `npm run dev` (the dev server is already configured with `host: true`
   in `vite.config.js`, so it's exposed on your LAN).
4. Make sure your phone is on the **same Wi-Fi network** as your laptop.
5. Generate a QR code and scan it — it will open the employee's profile
   directly on your phone.

That single line in `appConfig.js` is the only thing to change if your IP
changes (new network, new laptop, etc).

## Adding or editing employees

Everything is driven by `src/data/employees.json`. Add, remove, or edit an
entry there — no component code needs to change:

```json
{
  "employeeId": "EMP016",
  "name": "Jane Doe",
  "designation": "Product Manager",
  "department": "Product",
  "email": "jane.doe@nexora.com",
  "phone": "+91 90000 00000",
  "bloodGroup": "O+",
  "joiningDate": "2024-01-15",
  "profileImage": "",
  "address": "City, State",
  "status": "Active"
}
```

`profileImage` can be left as an empty string — the UI falls back to a
gradient avatar with the employee's initials.

## Project structure

```
src/
├── assets/             static images/illustrations (currently unused)
├── components/         Navbar, Footer, QRCard, ProfileCard, Badge, Button,
│                        NotFound, Toast, LoadingSkeleton
├── config/appConfig.js  the single BASE_URL setting used to build QR URLs
├── data/employees.json  static employee records — the only data source
├── hooks/               findEmployeeById / useEmployeeById, useToast
├── pages/                Home (Employee ID → Generate QR) and
│                         EmployeeProfile (/employee/:id)
├── styles/               global.css — design tokens, resets, shared animations
├── utils/                qrUtils.js — builds the QR URL, PNG export, print,
│                         clipboard, formatting
├── App.jsx
└── main.jsx
```

## Routes

| Path              | Page                                                    |
|-------------------|----------------------------------------------------------|
| `/`                | Home — Employee ID input + Generate QR                   |
| `/employee/:id`    | Employee profile — this is what each QR code opens        |
| any other path     | Friendly "Page not found" screen                          |

## Features

- Single, focused home screen: Employee ID in, QR code out — no directory,
  no search dropdown, no filters
- "Employee ID not found" inline error for invalid IDs
- Premium glassmorphism QR card with download-as-PNG, print, and copy-ID
- Employee profile page rendered purely from the URL param + JSON lookup
- Animated, dismissible toast notifications
- Light/dark theme toggle
- Shimmer loading skeleton on the profile page
- Fully responsive, from mobile to desktop, with visible keyboard focus states
