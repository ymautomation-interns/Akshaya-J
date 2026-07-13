// src/components/Picker/Calendar/WeekDays.jsx
import React from "react";
import { WEEKDAY_NAMES } from "../../../utils/dateUtils";

/**
 * WeekDays — renders the Sun/Mon/Tue... header row.
 * Stateless, no props needed beyond the constant list.
 * Used once per Calendar instance, regardless of mode.
 */
function WeekDays() {
  return (
    <div className="week-days">
      {WEEKDAY_NAMES.map((day) => (
        <span key={day} className="week-days__cell">
          {day}
        </span>
      ))}
    </div>
  );
}

export default WeekDays;
