import Avatar from './Avatar';
import { STATUS_LABELS, STATUS_STYLES, STATUS_DOT } from '../utils/timeFormat';

const EmployeeAttendanceCard = ({ employee, todayStatus, onClick }) => {
  const status = todayStatus?.status || 'not_checked_in';
  const label = STATUS_LABELS[status] || 'Not Checked In';
  const isLive = status === 'checked_in' || status === 'on_break';

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 flex flex-col items-center text-center
        hover:shadow-card-hover hover:border-primary-200 hover:-translate-y-0.5 transition-all"
    >
      <div className="relative mb-3">
        <Avatar name={employee.employee_name} size="lg" />
        {isLive && (
          <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
            <span
              className={`animate-pulse-ring absolute inline-flex h-full w-full rounded-full ${STATUS_DOT[status]}`}
            />
            <span className={`relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-white ${STATUS_DOT[status]}`} />
          </span>
        )}
      </div>
      <p className="font-semibold text-gray-800">{employee.employee_name}</p>
      <p className="text-xs text-gray-500 mt-0.5">{employee.employee_id}</p>
      <p className="text-xs text-gray-400 mt-0.5">{employee.role_name}</p>
      <span
        className={`mt-3 text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[status]}`}
      >
        {label}
      </span>
    </button>
  );
};

export default EmployeeAttendanceCard;
