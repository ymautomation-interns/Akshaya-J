import { Menu, Search, Bell } from 'lucide-react';
import Avatar from './Avatar';

const Navbar = ({ onMenuClick, title }) => {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between gap-4 px-4 md:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="md:hidden text-gray-600 hover:text-gray-900 shrink-0"
        >
          <Menu size={22} />
        </button>
        <div className="min-w-0">
          <h1 className="text-lg font-display font-bold text-gray-900 truncate">{title}</h1>
          <p className="text-xs text-gray-400 hidden sm:block">{today}</p>
        </div>
      </div>

      <div className="hidden md:flex items-center flex-1 max-w-sm">
        <div className="relative w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees, roles..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-canvas border border-gray-200 rounded-lg
              outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          className="relative text-gray-500 hover:text-gray-800 hover:bg-canvas rounded-full p-2 transition-colors"
          title="Notifications"
        >
          <Bell size={19} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent-500" />
        </button>
        <div className="flex items-center gap-2.5 pl-3 border-l border-gray-100">
          <Avatar name="Admin User" size="sm" />
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-semibold text-gray-800">Admin</p>
            <p className="text-[11px] text-gray-400">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
