// src/components/Picker/Calendar/Calendar.jsx
import React, { useState } from "react";
import CalendarHeader from "./CalendarHeader";
import WeekDays from "./WeekDays";
import CalendarGrid from "./CalendarGrid";
import "./Calendar.css";

/**
 * Calendar — the single reusable calendar block.
 *
 * This is used AS-IS by:
 *   - Mode 1 (singleDate): passes selectedDate + onSelectDate
 *   - Mode 2 (dateRange):  passes rangeStart/rangeEnd + onSelectDate
 *   - Mode 4 (dateTime):   same as Mode 1, plus a TimePicker rendered
 *                          alongside it by Picker.jsx
 *
 * Calendar does NOT know which "mode" is active. It only owns local
 * navigation state (which month/year is currently displayed) — that's
 * genuinely UI-local state, not business state, so useState here is
 * appropriate and doesn't leak into the parent.
 *
 * Selection state (which date(s) are chosen) is fully controlled by
 * the parent via props — this is what makes it reusable without
 * duplicating a single line of calendar logic.
 */
function Calendar({ selectedDate, rangeStart, rangeEnd, minDate, onSelectDate, initialMonthOffset = 0 }) {
  const initial = selectedDate || rangeStart || new Date();

  // initialMonthOffset only affects the FIRST render — e.g. a second,
  // side-by-side calendar in range mode defaults to showing next month
  // so both the start month and the end month are visible at once.
  // After that, this calendar's own Prev/Next/dropdowns take over and
  // navigate independently, same as any other Calendar instance.
  const [viewYear, setViewYear] = useState(() => {
    const d = new Date(initial);
    d.setMonth(d.getMonth() + initialMonthOffset);
    return d.getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date(initial);
    d.setMonth(d.getMonth() + initialMonthOffset);
    return d.getMonth();
  });

  const goToPrevMonth = () => {
    setViewMonth((prevMonth) => {
      if (prevMonth === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return prevMonth - 1;
    });
  };

  const goToNextMonth = () => {
    setViewMonth((prevMonth) => {
      if (prevMonth === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return prevMonth + 1;
    });
  };

  // Jumping directly to a chosen month/year from the header dropdowns
  const handleMonthChange = (monthIndex) => setViewMonth(monthIndex);
  const handleYearChange = (year) => setViewYear(year);

  return (
    <div className="calendar">
      <CalendarHeader
        year={viewYear}
        month={viewMonth}
        onPrev={goToPrevMonth}
        onNext={goToNextMonth}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
      />
      <WeekDays />
      <CalendarGrid
        year={viewYear}
        month={viewMonth}
        selectedDate={selectedDate}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        minDate={minDate}
        onSelectDate={onSelectDate}
      />
    </div>
  );
}

export default Calendar;
