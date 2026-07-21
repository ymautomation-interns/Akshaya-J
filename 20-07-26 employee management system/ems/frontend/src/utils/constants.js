import { LayoutDashboard, Users, ShieldCheck, CalendarCheck, FileClock } from 'lucide-react';

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard, enabled: true },
  { label: 'Employee Details', path: '/employees', icon: Users, enabled: true },
  { label: 'Roles', path: '/roles', icon: ShieldCheck, enabled: true },
  { label: 'Attendance', path: '/attendance', icon: CalendarCheck, enabled: true },
  { label: 'Leave Details', path: '/leave-details', icon: FileClock, enabled: true },
];
