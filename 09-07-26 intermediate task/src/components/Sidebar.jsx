import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Task 1 - Local CRUD', path: '/task1' },
  { label: 'Task 2 - React Query', path: '/task2' },
  { label: 'Task 3 - Pagination', path: '/task3' },
  { label: 'Task 4 - Search & Filter', path: '/task4' },
  { label: 'Task 5 - Add/Edit Modal', path: '/task5' },
  { label: 'Task 6 - useLocalStorage', path: '/task6' },
  { label: 'Task 7 - useMemo Search', path: '/task7' },
  { label: 'Task 8 - useCallback + memo', path: '/task8' },
  { label: 'Task 9 - Theme Provider', path: '/task9' },
  { label: 'Task 10 - Dashboard', path: '/task10' },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <p className="eyebrow">Employee Hub</p>
        <h1>Intermediate Task</h1>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
