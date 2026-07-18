import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";
import Button from "./Button";
import useCamera from "../hooks/useCamera";

/**
 * CameraCaptureModal
 * ---------------------------------------------------------------------------
 * Handles the "Take Photo" flow: opens the device camera via useCamera(),
 * shows a live mirrored preview with a circular framing guide, and captures
 * a still on shutter press. The captured data URL is handed back to
 * <ProfileEditor /> via `onCapture`, which then opens <ImageCropModal />.
 *
 * If the camera fails to start (no hardware, permission denied, or any
 * other error) this modal does not render its own error screen — instead it
 * immediately reports the failure to the parent via `onError(type)`, so
 * <ProfileEditor /> can close this modal and show the appropriate
 * "Camera Not Available" / "Camera Permission Required" popup.
 * ---------------------------------------------------------------------------
 */
export default function CameraCaptureModal({ isOpen, onClose, onCapture, onError }) {
  const { videoRef, isReady, error, start, stop, capture } = useCamera();

  useEffect(() => {
    if (isOpen) {
      start();
    } else {
      stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Bubble any camera failure up to the parent so it can show a dedicated,
  // friendly popup instead of leaving this raw video dialog on screen.
  useEffect(() => {
    if (error) {
      stop();
      onError?.(error.type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const handleShutter = () => {
    const dataUrl = capture();
    if (dataUrl) {
      stop();
      onCapture(dataUrl);
    }
  };

  const handleClose = () => {
    stop();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      variant="dialog"
      ariaLabel="Take a profile photo"
    >
      <div className="flex flex-col items-center gap-5 p-5 sm:p-6">
        <div className="relative flex h-72 w-72 items-center justify-center overflow-hidden rounded-full bg-black shadow-inner shadow-black/60 ring-1 ring-white/10">
          <video
            ref={videoRef}
            muted
            playsInline
            className="h-full w-full scale-x-[-1] object-cover"
          />
          {!isReady && (
            <span className="absolute h-8 w-8 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}
          <span className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-inset ring-white/20" />
        </div>

        <div className="flex w-full items-center justify-center gap-4 pt-1">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleShutter} disabled={!isReady}>
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-white" />
              Capture
            </span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}

CameraCaptureModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCapture: PropTypes.func.isRequired,
  /** Called with "not-found" | "permission-denied" | "generic" if the camera fails to start. */
  onError: PropTypes.func,
};
