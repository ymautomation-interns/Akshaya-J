# Intermediate Employee Dashboard

This project is a React + Vite application that demonstrates a complete employee management dashboard built as an intermediate-level task.

## Project Overview

The app includes the following features:

- Employee CRUD with local state persistence
- Employee data fetching using React Query
- Pagination support for employee records
- Search and filtering by employee fields
- Add/Edit employee modal form
- Reusable custom hook for localStorage
- Memoized search with `useMemo`
- Performance optimization using `useCallback` and `React.memo`
- Context API theme provider for light/dark switching
- Sidebar-based mini dashboard with routed task pages

## Tech Stack

- React
- Vite
- React Router DOM
- TanStack React Query

## Run the Project

```powershell
npm install
npm run dev
```

## Build the Project

```powershell
npm run build
```

## Lint the Project

```powershell
npm run lint
```

## Notes

This project is structured as a single-page dashboard application where each task is exposed through a sidebar navigation and routed page, making it easy to review every intermediate requirement in one place.
