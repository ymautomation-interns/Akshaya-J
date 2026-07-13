// src/utils/timeUtils.js
//
// Pure time helpers — no React. Mirrors dateUtils.js in spirit:
// all math lives here, components just render + call these.

export const PERIODS = ["AM", "PM"];

export function range(start, end) {
  const arr = [];
  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
}

export const HOURS = range(1, 12);      // 12-hour display
export const MINUTES = range(0, 59);

export function pad2(num) {
  return String(num).padStart(2, "0");
}

/** Clamps a typed/scrolled value into a valid range, wrapping if needed. */
export function clampWrap(value, min, max) {
  const span = max - min + 1;
  let v = value;
  while (v < min) v += span;
  while (v > max) v -= span;
  return v;
}

/**
 * Converts 12-hour + period into 24-hour format (for combining with a date).
 */
export function to24Hour(hour12, period) {
  let h = hour12 % 12;
  if (period === "PM") h += 12;
  return h;
}

/**
 * Converts 24-hour value into { hour12, period }.
 */
export function to12Hour(hour24) {
  const period = hour24 >= 12 ? "PM" : "AM";
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  return { hour12, period };
}

export function formatTime(hour12, minute, period) {
  return `${pad2(hour12)}:${pad2(minute)} ${period}`;
}
