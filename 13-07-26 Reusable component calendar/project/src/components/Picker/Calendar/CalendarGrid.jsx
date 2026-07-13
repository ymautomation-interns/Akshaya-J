// src/components/Picker/Calendar/CalendarGrid.jsx
import React, { useMemo } from "react";
import DayCell from "./DayCell";
import {
  buildCalendarMatrix,
  isSameDay,
  isToday as checkIsToday,
  isInRange,
  isRangeBoundary,
  isBefore,
} from "../../../utils/dateUtils";

/**
 * CalendarGrid — lays out DayCells in a 7-column grid for the given
 * year/month, and figures out each cell's visual state by delegating
 * to dateUtils helpers.
 *
 * It supports BOTH single-date and range selection through the same
 * props contract:
 *   - selectedDate: Date | null        (single mode)
 *   - rangeStart / rangeEnd: Date | null (range mode)
 *   - minDate: Date | null             (range mode) — any date before
 *     this is rendered disabled. Picker.jsx passes the chosen
 *     rangeStart here while an end date hasn't been picked yet, so
 *     the user can't pick an end date earlier than the start date.
 *
 * Whichever mode is active, the unused props are simply null, so the
 * grid naturally "does nothing" for booleans that don't apply.
 * This avoids branching logic scattered across components.
 */
function CalendarGrid({
  year,
  month,
  selectedDate,
  rangeStart,
  rangeEnd,
  minDate,
  onSelectDate,
}) {
  const cells = useMemo(() => buildCalendarMatrix(year, month), [year, month]);

  return (
    <div className="calendar-grid">
      {cells.map(({ date, isCurrentMonth }) => {
        const selected =
          (selectedDate && isSameDay(date, selectedDate)) || false;
        const boundary = isRangeBoundary(date, rangeStart, rangeEnd);
        const inRange = isInRange(date, rangeStart, rangeEnd);
        const disabled =
          (minDate && !isSameDay(date, minDate) && isBefore(date, minDate)) || false;

        return (
          <DayCell
            key={date.toISOString()}
            date={date}
            isCurrentMonth={isCurrentMonth}
            isSelected={selected}
            isRangeBoundary={boundary}
            isInRange={inRange}
            isToday={checkIsToday(date)}
            isDisabled={disabled}
            onSelect={onSelectDate}
          />
        );
      })}
    </div>
  );
}

export default CalendarGrid;
