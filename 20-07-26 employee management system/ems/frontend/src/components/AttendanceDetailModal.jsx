import { useState } from 'react';
import { LogIn, Coffee, PlayCircle, LogOut } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import Alert from './Alert';
import Avatar from './Avatar';
import useAttendanceTimer from '../hooks/useAttendanceTimer';
import { formatHMS, STATUS_LABELS, STATUS_STYLES } from '../utils/timeFormat';
import attendanceService from '../services/attendanceService';

const AttendanceDetailModal = ({ employee, attendance, isOpen, onClose, onUpdated }) => {
  const [loadingAction, setLoadingAction] = useState('');
  const [error, setError] = useState('');

  const { workingSeconds, breakSeconds } = useAttendanceTimer(attendance);

  if (!employee) return null;

  const status = attendance?.status || 'not_checked_in';

  const canCheckIn = status === 'not_checked_in';
  const canBreakStart = status === 'checked_in';
  const canBreakEnd = status === 'on_break';
  const canCheckOut = status === 'checked_in';

  const runAction = async (actionKey, apiCall) => {
    try {
      setLoadingAction(actionKey);
      setError('');
      await apiCall(employee.id);
      await onUpdated();
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed. Please try again.');
    } finally {
      setLoadingAction('');
    }
  };

  return (
    <Modal title="Attendance" isOpen={isOpen} onClose={onClose}>
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="flex flex-col items-center text-center mb-5">
        <div className="mb-2">
          <Avatar name={employee.employee_name} size="lg" />
        </div>
        <p className="font-semibold text-gray-800 text-lg">{employee.employee_name}</p>
        <p className="text-sm text-gray-500">{employee.employee_id}</p>
        <span
          className={`mt-2 text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[status]}`}
        >
          {STATUS_LABELS[status] || 'Not Checked In'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-canvas rounded-xl p-4 text-center border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Working Time</p>
          <p className="text-xl font-bold text-gray-900 font-mono tabular">{formatHMS(workingSeconds)}</p>
        </div>
        <div className="bg-canvas rounded-xl p-4 text-center border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">
            {status === 'on_break' ? 'Current Break' : 'Total Break'}
          </p>
          <p className="text-xl font-bold text-gray-900 font-mono tabular">{formatHMS(breakSeconds)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          icon={LogIn}
          variant="primary"
          disabled={!canCheckIn || loadingAction}
          onClick={() => runAction('checkin', attendanceService.checkIn)}
        >
          {loadingAction === 'checkin' ? 'Checking in...' : 'Check In'}
        </Button>
        <Button
          icon={Coffee}
          variant="secondary"
          disabled={!canBreakStart || loadingAction}
          onClick={() => runAction('breakstart', attendanceService.breakStart)}
        >
          {loadingAction === 'breakstart' ? 'Starting...' : 'Break Start'}
        </Button>
        <Button
          icon={PlayCircle}
          variant="secondary"
          disabled={!canBreakEnd || loadingAction}
          onClick={() => runAction('breakend', attendanceService.breakEnd)}
        >
          {loadingAction === 'breakend' ? 'Ending...' : 'Break End'}
        </Button>
        <Button
          icon={LogOut}
          variant="danger"
          disabled={!canCheckOut || loadingAction}
          onClick={() => runAction('checkout', attendanceService.checkOut)}
        >
          {loadingAction === 'checkout' ? 'Checking out...' : 'Check Out'}
        </Button>
      </div>

      {status === 'checked_out' && (
        <p className="text-xs text-center text-gray-400 mt-4">
          Attendance completed for today.
        </p>
      )}
    </Modal>
  );
};

export default AttendanceDetailModal;
