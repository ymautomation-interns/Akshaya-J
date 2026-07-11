import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useTheme } from '../context/useTheme.js'

export default function MainLayout() {
  const { theme } = useTheme()

  return (
    <div className={`app-shell ${theme}`}>
      <Sidebar />
      <main className="content-area">
        <Outlet />
      </main>
    </div>
  )
}
