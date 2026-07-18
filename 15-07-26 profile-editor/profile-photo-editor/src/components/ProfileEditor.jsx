import React, { useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";

import PhotoOptionsModal, { CameraIcon, GalleryIcon, TrashIcon } from "./PhotoOptionsModal";
import CameraCaptureModal from "./CameraCaptureModal";
import ImageCropModal from "./ImageCropModal";
import Modal from "./Modal";
import Button from "./Button";
import { checkCameraAvailability } from "../hooks/useCamera";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

/**
 * <ProfileEditor />
 * ---------------------------------------------------------------------------
 * Reusable, self-contained profile photo editor component, inspired by the
 * WhatsApp / Instagram profile picture update experience.
 *
 * Usage:
 *   <ProfileEditor takePhoto uploadPhoto onChange={(dataUrl) => ...} />
 *
 * This component owns all internal UI state (which sheet/modal is open, the
 * pending raw image, etc.) and only surfaces the final result through the
 * `onChange` callback — so it can be dropped into any form or settings page
 * without the parent needing to know about crop/zoom/filter internals.
 *
 * It also owns the circular avatar trigger itself (previously a separate
 * <ProfileAvatar /> component) since that markup is only ever rendered here.
 * ---------------------------------------------------------------------------
 */
export default function ProfileEditor({
  takePhoto = true,
  uploadPhoto = true,
  allowRemove = true,
  initialImage = null,
  size = 160,
  onChange,
}) {
  const [avatarSrc, setAvatarSrc] = useState(initialImage);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [pendingImage, setPendingImage] = useState(null); // raw image awaiting crop
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [fileError, setFileError] = useState(null);

  // Camera fallback popups — shown instead of the raw camera dialog when the
  // device has no camera at all, or when permission has been denied.
  const [isCameraMissingOpen, setIsCameraMissingOpen] = useState(false);
  const [isCameraDeniedOpen, setIsCameraDeniedOpen] = useState(false);
  const [isCheckingCamera, setIsCheckingCamera] = useState(false);

  const fileInputRef = useRef(null);

  const openOptions = () => {
    setFileError(null);
    setIsOptionsOpen(true);
  };
  const closeOptions = () => setIsOptionsOpen(false);

  const handleChooseUpload = () => {
    closeOptions();
    // Defer to next tick so the sheet closes before the native picker opens.
    setTimeout(() => fileInputRef.current?.click(), 0);
  };

  const handleChooseCamera = async () => {
    closeOptions();
    setFileError(null);

    // Detect whether a camera exists *before* attempting to open it, so a
    // desktop with no webcam gets a friendly popup instead of a dead dialog
    // or a raw browser error.
    setIsCheckingCamera(true);
    const hasCamera = await checkCameraAvailability();
    setIsCheckingCamera(false);

    if (!hasCamera) {
      setIsCameraMissingOpen(true);
      return;
    }
    setIsCameraOpen(true);
  };

  // Called by <CameraCaptureModal /> if getUserMedia fails once the dialog
  // is already open (e.g. permission denied, or hardware became unavailable
  // mid-flow). Swap the raw camera dialog for the matching friendly popup.
  const handleCameraError = (type) => {
    setIsCameraOpen(false);
    if (type === "permission-denied") {
      setIsCameraDeniedOpen(true);
    } else {
      setIsCameraMissingOpen(true);
    }
  };

  const handleRemovePhoto = () => {
    closeOptions();
    setAvatarSrc(null);
    onChange?.(null);
  };

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileError("Please choose a JPG, PNG or WEBP image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPendingImage(reader.result);
      setIsCropOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = (dataUrl) => {
    setIsCameraOpen(false);
    setPendingImage(dataUrl);
    setIsCropOpen(true);
  };
  const handleCropCancel = () => {
    setIsCropOpen(false);
    setPendingImage(null);
  };
  const handleCropSave = (finalDataUrl) => {
    setAvatarSrc(finalDataUrl);
    setIsCropOpen(false);
    setPendingImage(null);
    onChange?.(finalDataUrl);
  };
  // Triggered from either fallback popup's "Upload Photo" button.
  const handleFallbackUpload = (closeFallback) => {
    closeFallback();
    setTimeout(() => fileInputRef.current?.click(), 0);
  };
  // Options list is derived entirely from props — this is what makes the
  // sheet's contents dynamic per the takePhoto / uploadPhoto flags.
  const options = useMemo(() => {
    const list = [];
    if (takePhoto) {
      list.push({
        id: "take-photo",
        label: "Take Photo",
        icon: <CameraIcon />,
        onSelect: handleChooseCamera,
      });
    }
    if (uploadPhoto) {
      list.push({
        id: "upload-photo",
        label: "Upload Photo",
        icon: <GalleryIcon />,
        onSelect: handleChooseUpload,
      });
    }
    if (allowRemove && avatarSrc) {
      list.push({
        id: "remove-photo",
        label: "Remove Photo",
        icon: <TrashIcon />,
        tone: "danger",
        onSelect: handleRemovePhoto,
      });
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [takePhoto, uploadPhoto, allowRemove, avatarSrc]);

  return (
    <div className="pe-root inline-flex flex-col items-center gap-3">
      {/* ---- Avatar trigger ----
          Previously a separate <ProfileAvatar />; inlined here since it is
          only ever rendered by this component. */}
      <button
        type="button"
        onClick={openOptions}
        className="pe-avatar-trigger group relative inline-flex items-center justify-center rounded-full outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/40"
        style={{ width: size, height: size }}
        aria-label="Change profile photo"
      >
        <span className="pe-avatar-ring absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400/60 via-teal-400/30 to-transparent p-[3px] transition-transform duration-300 group-hover:scale-[1.04]">
          <span className="block h-full w-full rounded-full bg-[#1c1f24] p-[3px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="Profile photo"
                className="h-full w-full rounded-full object-cover"
                draggable={false}
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-slate-600 to-slate-800 text-white/70">
                <svg viewBox="0 0 24 24" fill="none" className="h-1/2 w-1/2" aria-hidden="true">
                  <path
                    d="M12 12a4.8 4.8 0 1 0 0-9.6 4.8 4.8 0 0 0 0 9.6Zm0 2.4c-4.42 0-8 2.15-8 4.8v1.2h16v-1.2c0-2.65-3.58-4.8-8-4.8Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
            )}
          </span>
        </span>

        {/* Hover dim overlay, WhatsApp-style "tap to change" hint */}
        <span className="pe-avatar-hover absolute inset-[3px] flex items-center justify-center rounded-full bg-black/0 text-transparent backdrop-blur-0 transition-all duration-200 group-hover:bg-black/45 group-hover:text-white group-hover:backdrop-blur-[2px] text-xs font-medium">
          {!isCheckingCamera && "Change"}
        </span>

        {isCheckingCamera && (
          <span className="absolute inset-[3px] flex items-center justify-center rounded-full bg-black/50">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </span>
        )}

        {/* Camera badge */}
        <span
          className="pe-camera-badge absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 text-white shadow-lg shadow-black/30 ring-4 ring-[#0f1115] transition-transform duration-200 group-hover:scale-110 group-active:scale-95"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path
              d="M9 3.5 7.6 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2.6L15 3.5H9Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </span>
      </button>

      {fileError && (
        <p role="alert" className="max-w-xs text-center text-xs font-medium text-red-400">
          {fileError}
        </p>
      )}

      {/* Hidden native file input — triggered programmatically */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleFileSelected}
      />

      <PhotoOptionsModal isOpen={isOptionsOpen} onClose={closeOptions} options={options} />

      {takePhoto && (
        <CameraCaptureModal
          isOpen={isCameraOpen}
          onClose={() => setIsCameraOpen(false)}
          onCapture={handleCameraCapture}
          onError={handleCameraError}
        />
      )}

      <ImageCropModal
        isOpen={isCropOpen}
        imageSrc={pendingImage}
        onCancel={handleCropCancel}
        onSave={handleCropSave}
      />

      {/* ---- Camera Not Available popup ----
          Shown when enumerateDevices() reports no videoinput hardware, or
          when the camera unexpectedly disappears mid-flow. Reuses the shared
          <Modal /> shell per the brief. */}
      <Modal
        isOpen={isCameraMissingOpen}
        onClose={() => setIsCameraMissingOpen(false)}
        variant="dialog"
        title="Camera Not Available"
        ariaLabel="Camera not available"
      >
        <div className="flex flex-col gap-5 px-5 pb-5 sm:px-6 sm:pb-6">
          <p className="text-sm leading-relaxed text-slate-300">
            No camera was detected on this device.
            <br />
            Please connect a camera or choose Upload Photo instead.
          </p>
          <div className="flex items-center gap-3">
            <Button variant="secondary" fullWidth onClick={() => setIsCameraMissingOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={() => handleFallbackUpload(() => setIsCameraMissingOpen(false))}
            >
              Upload Photo
            </Button>
          </div>
        </div>
      </Modal>

      {/* ---- Camera Permission Required popup ----
          Shown when a camera exists but getUserMedia() is rejected because
          permission was denied. */}
      <Modal
        isOpen={isCameraDeniedOpen}
        onClose={() => setIsCameraDeniedOpen(false)}
        variant="dialog"
        title="Camera Permission Required"
        ariaLabel="Camera permission required"
      >
        <div className="flex flex-col gap-5 px-5 pb-5 sm:px-6 sm:pb-6">
          <p className="text-sm leading-relaxed text-slate-300">
            Camera permission has been denied.
            <br />
            Please enable camera permission in your browser settings or upload a photo instead.
          </p>
          <div className="flex items-center gap-3">
            <Button variant="secondary" fullWidth onClick={() => setIsCameraDeniedOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={() => handleFallbackUpload(() => setIsCameraDeniedOpen(false))}
            >
              Upload Photo
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

ProfileEditor.propTypes = {
  /** Show the "Take Photo" option and enable camera capture. */
  takePhoto: PropTypes.bool,
  /** Show the "Upload Photo" option and enable the file picker. */
  uploadPhoto: PropTypes.bool,
  /** Show a "Remove Photo" option once an avatar has been set. */
  allowRemove: PropTypes.bool,
  /** Pre-existing avatar image (URL or data URL) to show initially. */
  initialImage: PropTypes.string,
  /** Diameter, in pixels, of the rendered avatar. */
  size: PropTypes.number,
  /** Called with the final circular-cropped data URL, or null on removal. */
  onChange: PropTypes.func,
};
