import React from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";
import Button from "./Button";

const CameraIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
    <path
      d="M9 3.5 7.6 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2.6L15 3.5H9Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const GalleryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M6 15.5 9.7 11l3 3.2 2.4-2.7L18.5 15.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="8.2" cy="8.7" r="1.3" fill="currentColor" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
    <path
      d="M5 7h14M9.5 7V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v2M7 7l.8 12a2 2 0 0 0 2 1.9h4.4a2 2 0 0 0 2-1.9L17 7"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * PhotoOptionsModal
 * ---------------------------------------------------------------------------
 * The first sheet shown after tapping the avatar. Renders its rows
 * dynamically from the `options` array, so `<ProfileEditor />` fully
 * controls which entries exist based on its `takePhoto` / `uploadPhoto`
 * props — no hardcoded feature flags live inside this component.
 * ---------------------------------------------------------------------------
 */
export default function PhotoOptionsModal({ isOpen, onClose, options }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="sheet" ariaLabel="Profile photo options">
      <div className="px-2 pb-4 pt-2 sm:px-3">
        <ul className="flex flex-col gap-1">
          {options.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                onClick={option.onSelect}
                className="pe-option-row flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-left text-[15px] font-medium text-slate-100 transition-all duration-150 hover:bg-white/8 hover:pl-5 active:scale-[0.99] active:bg-white/12"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform duration-150 ${
                    option.tone === "danger"
                      ? "bg-red-500/15 text-red-400"
                      : "bg-emerald-500/15 text-emerald-400"
                  }`}
                >
                  {option.icon}
                </span>
                <span className={option.tone === "danger" ? "text-red-400" : ""}>
                  {option.label}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-2 px-1 pb-1 sm:pb-0">
          <Button variant="secondary" fullWidth onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}

PhotoOptionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
      tone: PropTypes.oneOf(["default", "danger"]),
      onSelect: PropTypes.func.isRequired,
    })
  ).isRequired,
};

export { CameraIcon, GalleryIcon, TrashIcon };
