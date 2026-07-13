// src/components/Picker/Calendar/DayCell.jsx
import React from "react";

/**
 * DayCell — a single clickable date button.
 *
 * This is a "dumb" presentational component: it has NO idea whether
 * it's being used in singleDate, dateRange, or dateTime mode. It just
 * receives booleans describing its own visual state and an onClick
 * handler. This is what allows ONE component to be reused everywhere
 * a date needs to be rendered.
 */
function DayCell({
  date,
  isCurrentMonth,
  isSelected,
  isRangeBoundary,
  isInRange,
  isToday,
  isDisabled,
  onSelect,
}) {
  const classNames = [
    "day-cell",
    !isCurrentMonth && "day-cell--muted",
    isToday && "day-cell--today",
    isInRange && "day-cell--in-range",
    (isSelected || isRangeBoundary) && "day-cell--selected",
    isDisabled && "day-cell--disabled",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classNames}
      onClick={() => !isDisabled && onSelect(date)}
      disabled={isDisabled}
      aria-pressed={isSelected || isRangeBoundary}
      aria-disabled={isDisabled || undefined}
    >
      {date.getDate()}
    </button>
  );
}

export default DayCell;
