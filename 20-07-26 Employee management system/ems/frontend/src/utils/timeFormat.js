export const formatHMS = (totalSeconds = 0) => {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hrs = String(Math.floor(safeSeconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((safeSeconds % 3600) / 60)).padStart(2, '0');
  const secs = String(safeSeconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
};

export const formatDateTime = (isoString) => {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

export const formatDate = (isoString) => {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleDateString();
};

export const STATUS_LABELS = {
  checked_in: 'Checked In',
  on_break: 'On Break',
  checked_out: 'Checked Out',
};

export const STATUS_STYLES = {
  checked_in: 'bg-primary-50 text-primary-700',
  on_break: 'bg-accent-100 text-accent-700',
  checked_out: 'bg-gray-100 text-gray-600',
  not_checked_in: 'bg-gray-50 text-gray-400',
};

// Dot colors used for the live "signal" indicator wherever a compact status marker is shown
export const STATUS_DOT = {
  checked_in: 'bg-primary-500',
  on_break: 'bg-accent-500',
  checked_out: 'bg-gray-400',
  not_checked_in: 'bg-gray-300',
};
