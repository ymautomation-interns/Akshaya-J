import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Employees from './pages/Employees';
import Roles from './pages/Roles';
import Attendance from './pages/Attendance';
import LeaveDetails from './pages/LeaveDetails';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Home />} />
        <Route path="employees" element={<Employees />} />
        <Route path="roles" element={<Roles />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="leave-details" element={<LeaveDetails />} />
      </Route>
    </Routes>
  );
}

export default App;
