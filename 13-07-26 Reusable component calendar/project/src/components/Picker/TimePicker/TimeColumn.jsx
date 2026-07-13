// src/components/Picker/TimePicker/TimeColumn.jsx
import React, { useRef, useState } from "react";

/**
 * TimeColumn — ONE reusable column of a stepper-style value.
 *
 * TimePicker.jsx renders THREE of these (Hour, Minute, AM/PM) with
 * different `values` arrays and `onChange` handlers — no duplicated
 * markup or logic for each column type.
 *
 *   - Click:  the Up/Down arrow buttons step to the next/previous
 *             value in the list (wraps around at the ends).
 *   - Scroll: mouse wheel over the value box steps it up/down too.
 *   - Type:   the value box is an editable text field — type a value
 *             directly; on blur/Enter it's parsed, clamped to the
 *             valid list, and committed via onChange.
 *
 * There is no scrollable list here on purpose — this is a compact
 * "ledger counter" stepper, not a scroll wheel.
 */
function ChevronUpIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
      <path d="M2.5 7.5L6 4L9.5 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
      <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TimeColumn({ label, values, value, onChange, formatValue }) {
  const format = formatValue || ((v) => String(v));
  const [inputValue, setInputValue] = useState(() => format(value));
  const inputRef = useRef(null);

  // Keep the typed input in sync whenever the committed value changes
  // (e.g. after an arrow click or scroll updates it externally).
  React.useEffect(() => {
    setInputValue(format(value));
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const commitValue = (nextValue) => {
    onChange(nextValue);
  };

  const stepBy = (direction) => {
    const currentIndex = values.indexOf(value);
    const nextIndex = (currentIndex + direction + values.length) % values.length;
    commitValue(values[nextIndex]);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    stepBy(e.deltaY > 0 ? 1 : -1);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputCommit = () => {
    // Try to match a typed value against the valid values list.
    const parsed = isNaN(Number(inputValue))
      ? inputValue.toUpperCase()
      : Number(inputValue);

    const match = values.find((v) => v === parsed);

    if (match !== undefined) {
      commitValue(match);
    } else {
      // Invalid typed value -> revert to last committed value
      setInputValue(format(value));
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur(); // triggers handleInputCommit via onBlur
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      stepBy(1);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      stepBy(-1);
    }
  };

  return (
    <div className="time-column">
      <span className="time-column__label">{label}</span>

      <div className="time-column__box">
        <input
          ref={inputRef}
          type="text"
          className="time-column__input"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputCommit}
          onKeyDown={handleInputKeyDown}
          onWheel={handleWheel}
          inputMode={typeof value === "number" ? "numeric" : "text"}
          aria-label={label}
        />

        <div className="time-column__steps">
          <button
            type="button"
            className="time-column__step time-column__step--up"
            onClick={() => stepBy(1)}
            aria-label={`Increase ${label}`}
            tabIndex={-1}
          >
            <ChevronUpIcon />
          </button>
          <button
            type="button"
            className="time-column__step time-column__step--down"
            onClick={() => stepBy(-1)}
            aria-label={`Decrease ${label}`}
            tabIndex={-1}
          >
            <ChevronDownIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TimeColumn;
