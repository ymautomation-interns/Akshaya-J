// src/components/Picker/TimePicker/TimePicker.jsx
import React from "react";
import TimeColumn from "./TimeColumn";
import { HOURS, MINUTES, PERIODS, pad2 } from "../../../utils/timeUtils";
import "./TimePicker.css";

/**
 * TimePicker — full Hour / Minute / AM-PM picker.
 *
 * Used AS-IS in:
 *   - Mode 3 (time): rendered alone by Picker.jsx
 *   - Mode 4 (dateTime): rendered next to <Calendar />, sharing the
 *     same component with zero changes
 *
 * It is fully controlled: hour/minute/period + onChange handlers are
 * passed down from Picker.jsx, which owns the actual state. This
 * component only renders three TimeColumns — the reusable list/
 * scroll/type logic lives once, in TimeColumn.jsx.
 */
function TimePicker({ hour, minute, period, onChangeHour, onChangeMinute, onChangePeriod }) {
  return (
    <div className="time-picker">
      <TimeColumn
        label="Hour"
        values={HOURS}
        value={hour}
        onChange={onChangeHour}
        formatValue={(v) => pad2(v)}
      />
      <span className="time-picker__separator">:</span>
      <TimeColumn
        label="Minute"
        values={MINUTES}
        value={minute}
        onChange={onChangeMinute}
        formatValue={(v) => pad2(v)}
      />
      <TimeColumn
        label="Period"
        values={PERIODS}
        value={period}
        onChange={onChangePeriod}
        formatValue={(v) => v}
      />
    </div>
  );
}

export default TimePicker;
