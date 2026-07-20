import { useEffect, useState } from 'react';
import { Users, ShieldCheck, UserCheck, Coffee, LogOut, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import employeeService from '../services/employeeService';
import roleService from '../services/roleService';
import attendanceService from '../services/attendanceService';
import { STATUS_DOT } from '../utils/timeFormat';

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ employees: 0, roles: 0 });
  const [breakdown, setBreakdown] = useState({
    checked_in: 0,
    on_break: 0,
    checked_out: 0,
    not_checked_in: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [empRes, roleRes, todayRes] = await Promise.all([
          employeeService.getAll(),
          roleService.getAll(),
          attendanceService.getToday(),
        ]);
        const employees = empRes.data.data;
        const roles = roleRes.data.data;
        const todayRecords = todayRes.data.data;

        setStats({ employees: employees.length, roles: roles.length });

        const statusByEmployee = {};
        todayRecords.forEach((rec) => {
          statusByEmployee[rec.employee_id] = rec.status;
        });

        const counts = { checked_in: 0, on_break: 0, checked_out: 0, not_checked_in: 0 };
        employees.forEach((emp) => {
          const status = statusByEmployee[emp.id] || 'not_checked_in';
          counts[status] = (counts[status] || 0) + 1;
        });
        setBreakdown(counts);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const totalPresentish = breakdown.checked_in + breakdown.on_break;
  const total = stats.employees || 1;

  const snapshotRows = [
    { key: 'checked_in', label: 'Checked in', value: breakdown.checked_in, icon: UserCheck },
    { key: 'on_break', label: 'On break', value: breakdown.on_break, icon: Coffee },
    { key: 'checked_out', label: 'Checked out', value: breakdown.checked_out, icon: LogOut },
  ];

  return (
    <div>
      {/* Hero */}
      <div className="rounded-2xl bg-ink text-white p-6 md:p-8 mb-6 relative overflow-hidden">
        <div
          className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-primary-500/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative">
          <p className="text-primary-400 text-xs font-semibold uppercase tracking-wider mb-2">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h2 className="text-2xl md:text-3xl font-display font-bold">{greeting()}, Admin</h2>
          <p className="text-ink-muted mt-2 max-w-xl text-sm md:text-base">
            {loading
              ? 'Pulling the latest numbers for your organization...'
              : `${totalPresentish} of ${stats.employees} people are active right now. Here's where things stand.`}
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <Link
              to="/attendance"
              className="inline-flex items-center gap-1.5 bg-primary-500 hover:bg-primary-400 text-ink font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
            >
              Open attendance <ArrowRight size={15} />
            </Link>
            <Link
              to="/employees"
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors"
            >
              Manage employees
            </Link>
          </div>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {loading ? (
        <Loader label="Loading dashboard..." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Card title="Total Employees" value={stats.employees} icon={Users} color="blue" />
            <Card title="Total Roles" value={stats.roles} icon={ShieldCheck} color="purple" />
            <Card
              title="Active Right Now"
              value={totalPresentish}
              icon={UserCheck}
              color="green"
              hint={`${breakdown.on_break} on break`}
            />
          </div>

          {/* Live status snapshot - built from today's real attendance records */}
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 md:p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-display font-bold text-gray-900">Today's Attendance Snapshot</h3>
                <p className="text-xs text-gray-400 mt-0.5">Live status across your organization</p>
              </div>
              <Link
                to="/attendance"
                className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                View details <ArrowRight size={13} />
              </Link>
            </div>

            {/* Composition bar */}
            <div className="flex w-full h-2.5 rounded-full overflow-hidden bg-gray-100 mb-6">
              {snapshotRows.map((row) => (
                <div
                  key={row.key}
                  className={STATUS_DOT[row.key]}
                  style={{ width: `${(row.value / total) * 100}%` }}
                  title={`${row.label}: ${row.value}`}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {snapshotRows.map((row) => (
                <div key={row.key} className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${STATUS_DOT[row.key]}`} />
                  <row.icon size={16} className="text-gray-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 tabular">{row.value}</p>
                    <p className="text-xs text-gray-400">{row.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
