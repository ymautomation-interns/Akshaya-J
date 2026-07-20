import { FileClock } from 'lucide-react';

const LeaveDetails = () => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-display font-bold text-gray-900">Leave Details</h2>
        <p className="text-sm text-gray-500 mt-1">Track and approve time off requests.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-10 md:p-16 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-accent-100 text-accent-700 flex items-center justify-center mb-4">
          <FileClock size={26} />
        </div>
        <h3 className="font-display font-semibold text-gray-900 text-lg">Leave management is on the way</h3>
        <p className="text-sm text-gray-500 mt-2 max-w-sm">
          Requests, approvals, and balances will show up here once this module goes live.
          Employee and attendance data are already flowing in — this is next.
        </p>
      </div>
    </div>
  );
};

export default LeaveDetails;
