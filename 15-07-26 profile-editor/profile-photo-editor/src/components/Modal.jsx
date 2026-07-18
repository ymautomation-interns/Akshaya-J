import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

/**
 * Modal
 * ---------------------------------------------------------------------------
 * Generic overlay shell shared by every dialog/sheet in the editor
 * (PhotoOptionsModal, ImageCropModal, CameraCaptureModal, and the inline
 * "Camera Not Available" / "Camera Permission Required" alerts rendered by
 * ProfileEditor). Responsibilities:
 *   - Renders a dimmed, blurred glass backdrop that closes the modal on click.
 *   - Locks page scroll while open.
 *   - Closes on Escape and moves initial focus into the dialog.
 *   - Adapts presentation: a centered "card" on desktop, a bottom sheet
 *     on small screens (via the `variant` prop), matching the WhatsApp /
 *     Material 3 pattern of sheets on mobile, dialogs on desktop.
 * ---------------------------------------------------------------------------
 */
export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  variant = "sheet", // "sheet" | "dialog"
  closeOnBackdrop = true,
  ariaLabel = "Dialog",
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKeyDown);

    // Move initial focus into the dialog for keyboard users.
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="pe-modal-root fixed inset-0 z-[999] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="presentation"
    >
      {/* Backdrop */}
      <div
        className="pe-modal-backdrop absolute inset-0 bg-black/70 backdrop-blur-md animate-pe-fade-in"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={
          variant === "sheet"
            ? "pe-sheet pe-glass-panel relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl text-white outline-none animate-pe-slide-up sm:animate-pe-pop-in"
            : "pe-dialog pe-glass-panel relative w-[92vw] max-w-md rounded-3xl text-white outline-none animate-pe-pop-in"
        }
      >
        <div className="pe-sheet-handle mx-auto mt-3 h-1.5 w-10 rounded-full bg-white/20 sm:hidden" />

        {title && (
          <div className="px-5 pt-5 pb-1 sm:px-6">
            <h2 className="text-base font-semibold tracking-tight text-white sm:text-lg">
              {title}
            </h2>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  children: PropTypes.node,
  title: PropTypes.string,
  variant: PropTypes.oneOf(["sheet", "dialog"]),
  closeOnBackdrop: PropTypes.bool,
  ariaLabel: PropTypes.string,
};
