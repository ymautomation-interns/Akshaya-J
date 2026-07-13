// src/components/Picker/Picker.jsx
import React, { useRef, useState } from "react";
import Calendar from "./Calendar/Calendar";
import TimePicker from "./TimePicker/TimePicker";
import useClickOutside from "../../hooks/useClickOutside";
import { formatDate, isSameDay, combineDateAndTime } from "../../utils/dateUtils";
import { to24Hour } from "../../utils/timeUtils";
import "./Picker.css";

/**
 * Picker — the ONE public component this library exposes.
 *
 * <Picker singleDate={true} dateRange={false} time={false} dateTime={false} />
 * <Picker singleDate={false} dateRange={true} time={false} dateTime={false} />
 * <Picker singleDate={false} dateRange={false} time={true} dateTime={false} />
 * <Picker singleDate={false} dateRange={false} time={false} dateTime={true} />
 *
 * UI behavior:
 *   - Renders as a closed input field by default (no calendar visible).
 *   - Clicking the input opens a popup below it with the picker that
 *     matches the active mode (Calendar, Calendar+Range, TimePicker,
 *     or Calendar+TimePicker).
 *   - Selecting a value closes the popup and shows the formatted
 *     selection inside the input.
 *   - Clicking outside the popup closes it without losing the
 *     selection made so far.
 */

/**
 * Resolves which single mode is "active" from the incoming props.
 * Priority order: singleDate > dateRange > time > dateTime.
 * If more than one prop is true (developer error), only the first
 * matching mode renders, and a console warning explains why.
 */
export function resolveActiveMode({ singleDate, dateRange, time, dateTime }) {
  const trueModes = [
    singleDate && "singleDate",
    dateRange && "dateRange",
    time && "time",
    dateTime && "dateTime",
  ].filter(Boolean);

  if (trueModes.length > 1) {
    // eslint-disable-next-line no-console
    console.warn(
      `<Picker /> received multiple true mode props: [${trueModes.join(
        ", "
      )}]. Only "${trueModes[0]}" will be rendered. ` +
        `Pass exactly one of singleDate / dateRange / time / dateTime as true.`
    );
  }

  return trueModes[0] || null;
}

const PLACEHOLDER_BY_MODE = {
  singleDate: "Select date",
  dateRange: "Select date range",
  time: "Select time",
  dateTime: "Select date & time",
  null: "Select a mode",
};

function CalendarIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="4.5" width="14" height="12.5" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 8.5H17" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.5 2.5V5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13.5 2.5V5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6.5V10L12.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Picker({ singleDate, dateRange, time, dateTime }) {
  const activeMode = resolveActiveMode({ singleDate, dateRange, time, dateTime });

  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  useClickOutside(wrapperRef, () => setIsOpen(false), isOpen);

  // Keep the page still behind the popup while it's open, since the
  // popup is now a fixed, centered overlay rather than something that
  // scrolls along with the page.
  React.useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // ---- Mode 1 & 4 state: single date selection ----
  const [selectedDate, setSelectedDate] = useState(null);

  // ---- Mode 2 state: range selection ----
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);

  // ---- Mode 3 & 4 state: time selection ----
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [period, setPeriod] = useState("AM");

  const handleRangeSelect = (date) => {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(date);
      setRangeEnd(null);
      return;
    }
    if (isSameDay(date, rangeStart)) {
      setRangeEnd(date);
      setIsOpen(false);
      return;
    }
    if (date < rangeStart) {
      setRangeEnd(rangeStart);
      setRangeStart(date);
    } else {
      setRangeEnd(date);
    }
    setIsOpen(false);
  };

  const handleSingleSelect = (date) => {
    setSelectedDate(date);
    // In dateTime mode, keep the popup open so the user can also pick a time.
    if (activeMode === "singleDate") {
      setIsOpen(false);
    }
  };

  // ---- Derived display text shown inside the input ----
  let displayValue = "";

  if (activeMode === "singleDate" && selectedDate) {
    displayValue = formatDate(selectedDate);
  }

  if (activeMode === "dateRange") {
    if (rangeStart && rangeEnd) {
      displayValue = `${formatDate(rangeStart)}  →  ${formatDate(rangeEnd)}`;
    } else if (rangeStart) {
      displayValue = `${formatDate(rangeStart)}  →  ...`;
    }
  }

  if (activeMode === "time") {
    displayValue = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${period}`;
  }

  if (activeMode === "dateTime" && selectedDate) {
    const hour24 = to24Hour(hour, period);
    const combined = combineDateAndTime(selectedDate, hour24, minute);
    displayValue = `${formatDate(combined)}, ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${period}`;
  }

  const placeholder = PLACEHOLDER_BY_MODE[activeMode] || PLACEHOLDER_BY_MODE.null;
  const Icon = activeMode === "time" ? ClockIcon : CalendarIcon;

  if (!activeMode) {
    return (
      <div className="picker">
        <div className="picker__empty">
          Pass one of <code>singleDate</code>, <code>dateRange</code>,{" "}
          <code>time</code>, or <code>dateTime</code> as <code>true</code>.
        </div>
      </div>
    );
  }

  return (
    <div className="picker" ref={wrapperRef}>
      <button
        type="button"
        className={"picker__input" + (isOpen ? " picker__input--open" : "")}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="picker__input-icon">
          <Icon />
        </span>
        <span
          className={
            "picker__input-text" + (!displayValue ? " picker__input-text--placeholder" : "")
          }
        >
          {displayValue || placeholder}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="picker__backdrop"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="picker__popup">
            {activeMode === "singleDate" && (
              <Calendar selectedDate={selectedDate} onSelectDate={handleSingleSelect} />
            )}

            {activeMode === "dateRange" && (
              <div className="picker__range-row">
                <Calendar
                  rangeStart={rangeStart}
                  rangeEnd={rangeEnd}
                  minDate={rangeStart && !rangeEnd ? rangeStart : null}
                  onSelectDate={handleRangeSelect}
                />
                <div className="picker__stub-divider" aria-hidden="true" />
                <Calendar
                  rangeStart={rangeStart}
                  rangeEnd={rangeEnd}
                  minDate={rangeStart && !rangeEnd ? rangeStart : null}
                  onSelectDate={handleRangeSelect}
                  initialMonthOffset={1}
                />
              </div>
            )}

            {activeMode === "time" && (
              <TimePicker
                hour={hour}
                minute={minute}
                period={period}
                onChangeHour={setHour}
                onChangeMinute={setMinute}
                onChangePeriod={setPeriod}
              />
            )}

            {activeMode === "dateTime" && (
              <div className="picker__datetime-row">
                <Calendar selectedDate={selectedDate} onSelectDate={handleSingleSelect} />
                <div className="picker__stub-divider" aria-hidden="true" />
                <TimePicker
                  hour={hour}
                  minute={minute}
                  period={period}
                  onChangeHour={setHour}
                  onChangeMinute={setMinute}
                  onChangePeriod={setPeriod}
                />
              </div>
            )}

            {activeMode === "dateTime" && selectedDate && (
              <div className="picker__popup-footer">
                <span className="picker__popup-footer-hint">Confirm to lock in your slot</span>
                <button
                  type="button"
                  className="picker__done-btn"
                  onClick={() => setIsOpen(false)}
                >
                  Confirm
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Picker;
