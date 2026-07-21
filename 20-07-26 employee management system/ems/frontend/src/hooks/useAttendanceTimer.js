import { useEffect, useState } from 'react';

/**
 * Computes live working & break timers from server-provided timestamps.
 * Ticks every second while attendance is active (checked_in / on_break).
 * Uses real timestamps (not just accumulating frontend state) so the
 * timer stays correct even after a page refresh.
 */
const useAttendanceTimer = (attendance) => {
  const [now, setNow] = useState(Date.now());

  const isActive = attendance && attendance.status !== 'checked_out';

  useEffect(() => {
    if (!isActive) return undefined;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [isActive, attendance?.attendance_id, attendance?.status]);

  if (!attendance) {
    return { workingSeconds: 0, breakSeconds: 0 };
  }

  const { status, check_in, check_out, total_break_seconds = 0, total_working_seconds = 0, breaks = [] } = attendance;

  if (status === 'checked_out') {
    return { workingSeconds: total_working_seconds, breakSeconds: total_break_seconds };
  }

  const checkInMs = new Date(check_in).getTime();
  const totalElapsedSeconds = Math.floor((now - checkInMs) / 1000);

  const openBreak = breaks.find((b) => !b.break_end);
  const currentBreakSeconds = openBreak
    ? Math.floor((now - new Date(openBreak.break_start).getTime()) / 1000)
    : 0;

  const workingSeconds = Math.max(
    totalElapsedSeconds - total_break_seconds - currentBreakSeconds,
    0
  );

  return {
    workingSeconds,
    breakSeconds: status === 'on_break' ? currentBreakSeconds : total_break_seconds,
  };
};

export default useAttendanceTimer;
