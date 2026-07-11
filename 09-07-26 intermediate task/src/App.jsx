import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import MainLayout from './layouts/MainLayout.jsx'
import DashboardHome from './pages/DashboardHome.jsx'
import TaskOnePage from './pages/TaskOnePage.jsx'
import TaskTwoPage from './pages/TaskTwoPage.jsx'
import TaskThreePage from './pages/TaskThreePage.jsx'
import TaskFourPage from './pages/TaskFourPage.jsx'
import TaskFivePage from './pages/TaskFivePage.jsx'
import TaskSixPage from './pages/TaskSixPage.jsx'
import TaskSevenPage from './pages/TaskSevenPage.jsx'
import TaskEightPage from './pages/TaskEightPage.jsx'
import TaskNinePage from './pages/TaskNinePage.jsx'
import TaskTenPage from './pages/TaskTenPage.jsx'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/task1" element={<TaskOnePage />} />
        <Route path="/task2" element={<TaskTwoPage />} />
        <Route path="/task3" element={<TaskThreePage />} />
        <Route path="/task4" element={<TaskFourPage />} />
        <Route path="/task5" element={<TaskFivePage />} />
        <Route path="/task6" element={<TaskSixPage />} />
        <Route path="/task7" element={<TaskSevenPage />} />
        <Route path="/task8" element={<TaskEightPage />} />
        <Route path="/task9" element={<TaskNinePage />} />
        <Route path="/task10" element={<TaskTenPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
