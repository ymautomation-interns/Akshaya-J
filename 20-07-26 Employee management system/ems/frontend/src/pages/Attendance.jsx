import { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import Table from '../components/Table';
import EmployeeAttendanceCard from '../components/EmployeeAttendanceCard';
import AttendanceDetailModal from '../components/AttendanceDetailModal';
import employeeService from '../services/employeeService';
import attendanceService from '../services/attendanceService';
import { formatHMS, formatDateTime, formatDate, STATUS_LABELS, STATUS_STYLES } from '../utils/timeFormat';

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [todayMap, setTodayMap] = useState({}); // employee_id -> attendance record
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadAll = async () => {
    try {
      const [empRes, todayRes, historyRes] = await Promise.all([
        employeeService.getAll(),
        attendanceService.getToday(),
        attendanceService.getHistory(),
      ]);

      setEmployees(empRes.data.data);

      const map = {};
      todayRes.data.data.forEach((rec) => {
        map[rec.employee_id] = rec;
      });
      setTodayMap(map);

      setHistory(historyRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load attendance data');
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadAll();
      setLoading(false);
    })();
  }, []);

  const handleCardClick = (employee) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  };

  const handleUpdated = async () => {
    await loadAll();
    setSelectedEmployee((prev) => (prev ? { ...prev } : prev));
  };

  const selectedAttendance = selectedEmployee ? todayMap[selectedEmployee.id] : null;

  const historyColumns = [
    { key: 'emp_code', label: 'Employee ID' },
    { key: 'employee_name', label: 'Employee Name' },
    { key: 'attendance_date', label: 'Date', render: (row) => formatDate(row.attendance_date) },
    { key: 'check_in', label: 'Check In', render: (row) => formatDateTime(row.check_in) },
    { key: 'check_out', label: 'Check Out', render: (row) => formatDateTime(row.check_out) },
    {
      key: 'total_break_seconds',
      label: 'Total Break Hours',
      render: (row) => formatHMS(row.total_break_seconds),
    },
    {
      key: 'total_working_seconds',
      label: 'Total Working Hours',
      render: (row) => formatHMS(row.total_working_seconds),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[row.status]}`}>
          {STATUS_LABELS[row.status] || row.status}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-display font-bold text-gray-900">Attendance</h2>
        <p className="text-sm text-gray-500 mt-1">
          Tap an employee to check in, take breaks, or check out.
        </p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {loading ? (
        <Loader label="Loading attendance..." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {employees.map((emp) => (
              <EmployeeAttendanceCard
                key={emp.id}
                employee={emp}
                todayStatus={todayMap[emp.id]}
                onClick={() => handleCardClick(emp)}
              />
            ))}
          </div>

          <h3 className="font-display font-semibold text-gray-900 mb-3">Attendance History</h3>
          <Table columns={historyColumns} data={history} emptyMessage="No attendance records yet" />
        </>
      )}

      <AttendanceDetailModal
        employee={selectedEmployee}
        attendance={selectedAttendance}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onUpdated={handleUpdated}
      />
    </div>
  );
};

export default Attendance;
