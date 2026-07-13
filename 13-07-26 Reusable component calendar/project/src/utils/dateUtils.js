// src/utils/dateUtils.js
//
// Pure, framework-agnostic date helpers.
// No React here on purpose — this logic is reused by singleDate,
// dateRange, and dateTime modes without any duplication.

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Returns the number of days in a given month.
 * @param {number} year
 * @param {number} month - 0-indexed (0 = Jan)
 */
export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Returns the weekday index (0-6, Sun-Sat) of the 1st of the given month.
 */
export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

/**
 * Builds a flat array of cell descriptors for a full calendar grid,
 * including leading/trailing days from adjacent months so the grid
 * always fills complete weeks (rows of 7).
 *
 * Each cell: { date: Date, isCurrentMonth: boolean }
 */
export function buildCalendarMatrix(year, month) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstWeekday = getFirstDayOfMonth(year, month);

  const daysInPrevMonth = getDaysInMonth(year, month - 1);

  const cells = [];

  // Leading days (from previous month) to fill the first week
  for (let i = firstWeekday - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const date = new Date(year, month - 1, day);
    cells.push({ date, isCurrentMonth: false });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    cells.push({ date, isCurrentMonth: true });
  }

  // Trailing days (from next month) to complete the last week
  const remainder = cells.length % 7;
  if (remainder !== 0) {
    const trailingCount = 7 - remainder;
    for (let day = 1; day <= trailingCount; day++) {
      const date = new Date(year, month + 1, day);
      cells.push({ date, isCurrentMonth: false });
    }
  }

  return cells;
}

/** Strips time component for pure date comparison. */
export function stripTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isSameDay(a, b) {
  if (!a || !b) return false;
  const d1 = stripTime(a);
  const d2 = stripTime(b);
  return d1.getTime() === d2.getTime();
}

export function isToday(date) {
  return isSameDay(date, new Date());
}

/** True if `date` is strictly between `start` and `end` (exclusive). */
export function isInRange(date, start, end) {
  if (!start || !end) return false;
  const d = stripTime(date).getTime();
  const s = stripTime(start).getTime();
  const e = stripTime(end).getTime();
  const lo = Math.min(s, e);
  const hi = Math.max(s, e);
  return d > lo && d < hi;
}

/** True if `date` equals either boundary of the range. */
export function isRangeBoundary(date, start, end) {
  return isSameDay(date, start) || isSameDay(date, end);
}

export function isBefore(a, b) {
  return stripTime(a).getTime() < stripTime(b).getTime();
}

/**
 * Formats a Date as a readable string, e.g. "12 Jul 2026".
 */
export function formatDate(date) {
  if (!date) return "";
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()].slice(0, 3);
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Generates a list of selectable years centered around `centerYear`,
 * used to populate the custom Year dropdown in CalendarHeader.
 */
export function getYearRange(centerYear, before = 80, after = 12) {
  const years = [];
  for (let y = centerYear - before; y <= centerYear + after; y++) {
    years.push(y);
  }
  return years;
}

/**
 * Combines a plain date with hour/minute/period (from timeUtils)
 * into a single Date object. Used by dateTime mode.
 */
export function combineDateAndTime(date, hour24, minute) {
  if (!date) return null;
  const result = new Date(date);
  result.setHours(hour24, minute, 0, 0);
  return result;
}
