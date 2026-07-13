// src/components/Picker/Calendar/CalendarHeader.jsx
import React from "react";
import YearGrid from "../Selector/YearGrid";
import { MONTH_NAMES, getYearRange } from "../../../utils/dateUtils";

/**
 * CalendarHeader — Prev button, Month label (stepper, no dropdown),
 * Year grid-picker, Next button.
 *
 * Fully controlled via props: it doesn't own the current month/year
 * itself. The parent (Calendar.jsx) owns that state and passes down
 * `year`, `month`, `onPrev`, `onNext`, `onMonthChange`, `onYearChange`.
 *
 * Month is stepped only via the Prev/Next arrows (no dropdown list —
 * this is the same for EVERY Calendar instance in the app, since they
 * all render this one CalendarHeader).
 *
 * Year opens a grid picker (rows x columns of years) instead of a
 * scrolling dropdown list.
 */
function CalendarHeader({ year, month, onPrev, onNext, onMonthChange, onYearChange }) {
  const yearOptions = getYearRange(new Date().getFullYear());

  return (
    <div className="calendar-header">
      <button
        type="button"
        className="calendar-header__nav-btn"
        onClick={onPrev}
        aria-label="Previous month"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="calendar-header__selectors">
        <span className="calendar-header__month-label">{MONTH_NAMES[month]}</span>
        <YearGrid years={yearOptions} value={year} onChange={onYearChange} />
      </div>

      <button
        type="button"
        className="calendar-header__nav-btn"
        onClick={onNext}
        aria-label="Next month"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

export default CalendarHeader;
