// src/components/Picker/Selector/Selector.jsx
import React, { useRef, useState } from "react";
import useClickOutside from "../../../hooks/useClickOutside";
import "./Selector.css";

/**
 * Selector — a custom, styleable dropdown (never a native <select>).
 *
 * Reused for BOTH the Month dropdown and the Year dropdown in
 * CalendarHeader.jsx — same component, different `options`/`value`.
 * This is what keeps "Month ▼" and "Year ▼" from being two separate
 * hand-rolled dropdown implementations.
 *
 * @param {Array<{value:any,label:string}>} options
 * @param {*} value - currently selected option's value
 * @param {Function} onChange - called with the new value on selection
 */
function Selector({ options, value, onChange, variant }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useClickOutside(wrapperRef, () => setOpen(false), open);

  const selected = options.find((o) => o.value === value);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setOpen(false);
  };

  const variantClass = variant ? ` selector__trigger--${variant}` : "";

  return (
    <div className="selector" ref={wrapperRef}>
      <button
        type="button"
        className={"selector__trigger" + variantClass + (open ? " selector__trigger--open" : "")}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{selected ? selected.label : "Select"}</span>
        <svg
          className="selector__chevron"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M2.5 4.5L6 8L9.5 4.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="selector__popup">
          <div className="selector__list">
            {options.map((option) => (
              <button
                type="button"
                key={option.value}
                className={
                  "selector__option" +
                  (option.value === value ? " selector__option--selected" : "")
                }
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Selector;
