// src/components/Picker/Selector/YearGrid.jsx
import React, { useEffect, useRef, useState } from "react";
import useClickOutside from "../../../hooks/useClickOutside";
import "./Selector.css";

const COLUMNS = 4; // e.g. 4 cols x 3 rows = 12 years per page

/**
 * YearGrid — replaces the old scrolling Year <Selector /> list.
 *
 * Clicking the year ("2026") opens a popup showing years laid out in
 * a grid (COLUMNS columns x several rows) instead of a single
 * scrollable column. The popup pages backward/forward a block of
 * years at a time via small ‹ › controls at the top of the grid.
 */
function YearGrid({ years, value, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  useClickOutside(wrapperRef, () => setOpen(false), open);

  const perPage = COLUMNS * 3; // 3 rows visible per page

  // Which page (block of `perPage` years) is showing. Recomputed
  // whenever the popup opens so it always starts centered on `value`.
  const pageForYear = (year) => {
    const index = years.indexOf(year);
    const safeIndex = index === -1 ? 0 : index;
    return Math.floor(safeIndex / perPage);
  };

  const [page, setPage] = useState(() => pageForYear(value));

  useEffect(() => {
    if (open) setPage(pageForYear(value));
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalPages = Math.ceil(years.length / perPage);
  const pageYears = years.slice(page * perPage, page * perPage + perPage);

  const handleSelect = (year) => {
    onChange(year);
    setOpen(false);
  };

  return (
    <div className="selector" ref={wrapperRef}>
      <button
        type="button"
        className={
          "selector__trigger selector__trigger--year" + (open ? " selector__trigger--open" : "")
        }
        onClick={() => setOpen((o) => !o)}
      >
        <span>{value}</span>
        <svg className="selector__chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
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
        <div className="selector__popup selector__popup--year-grid">
          <div className="year-grid__paging">
            <button
              type="button"
              className="year-grid__page-btn"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              aria-label="Earlier years"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="year-grid__page-label">
              {pageYears[0]}–{pageYears[pageYears.length - 1]}
            </span>
            <button
              type="button"
              className="year-grid__page-btn"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              aria-label="Later years"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="year-grid">
            {pageYears.map((y) => (
              <button
                type="button"
                key={y}
                className={
                  "year-grid__cell" + (y === value ? " year-grid__cell--selected" : "")
                }
                onClick={() => handleSelect(y)}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default YearGrid;
