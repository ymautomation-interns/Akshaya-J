import { NavLink } from 'react-router-dom';
import { Waypoints, ChevronLeft, ChevronRight } from 'lucide-react';
import { NAV_ITEMS } from '../utils/constants';

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static top-0 left-0 h-full z-40 bg-ink text-white
          flex flex-col transition-all duration-200 shadow-panel
          ${collapsed ? 'md:w-[76px]' : 'md:w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
          w-64`}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-4 h-16 border-b border-ink-border shrink-0">
          <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center shrink-0">
            <Waypoints size={18} className="text-ink" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-display font-bold text-white leading-tight whitespace-nowrap">
                EMS<span className="text-primary-400"></span>
              </p>
              <p className="text-[10px] uppercase tracking-wider text-ink-muted whitespace-nowrap">
                Operations Console
              </p>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-4 px-2.5 space-y-1">
          {!collapsed && (
            <p className="px-2.5 mb-2 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
              Workspace
            </p>
          )}
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive ? 'bg-ink-softer text-white' : 'text-ink-muted hover:bg-ink-soft hover:text-white'}`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-primary-500 transition-opacity
                      ${isActive ? 'opacity-100' : 'opacity-0'}`}
                  />
                  <item.icon size={19} className="shrink-0" />
                  {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle - desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex items-center justify-center gap-2 h-12 border-t border-ink-border text-ink-muted hover:text-white hover:bg-ink-soft shrink-0"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <>
              <ChevronLeft size={18} />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
