import { useCallback, useEffect, useRef, useState } from "react";

/**
 * checkCameraAvailability
 * ---------------------------------------------------------------------------
 * Lightweight, permission-free check for whether this device has *any*
 * camera hardware at all. Uses `enumerateDevices`, which (unlike
 * `getUserMedia`) does not prompt the user or require permission to tell us
 * whether a videoinput device exists.
 *
 * We use this *before* attempting to open the camera so we can show a
 * friendly "Camera Not Available" message instead of letting the browser's
 * own getUserMedia call fail with a generic error.
 * ---------------------------------------------------------------------------
 */
export async function checkCameraAvailability() {
  if (!navigator.mediaDevices?.enumerateDevices) {
    return false;
  }
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some((device) => device.kind === "videoinput");
  } catch {
    // If the browser refuses to tell us, assume no camera rather than
    // letting the app crash further down the flow.
    return false;
  }
}

/**
 * useCamera
 * ---------------------------------------------------------------------------
 * Encapsulates all browser Camera API concerns (getUserMedia lifecycle,
 * permission errors, cleanup) so components only deal with a simple API:
 *
 *   const { videoRef, error, isReady, start, stop, capture } = useCamera();
 *
 * `error` is `{ type, message }` where `type` is one of:
 *   "not-found"         no camera hardware could be started
 *   "permission-denied"  user (or browser policy) blocked camera access
 *   "generic"            any other unexpected failure
 *
 * `capture()` returns a data URL (JPEG) snapshot of the current video frame.
 * ---------------------------------------------------------------------------
 */
export default function useCamera() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  const stop = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsReady(false);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsReady(true);
    } catch (err) {
      let type = "generic";
      let message = "Unable to access camera on this device.";

      if (err?.name === "NotAllowedError" || err?.name === "SecurityError") {
        type = "permission-denied";
        message = "Camera access was denied. Please allow camera permissions.";
      } else if (err?.name === "NotFoundError" || err?.name === "OverconstrainedError") {
        type = "not-found";
        message = "No camera was detected on this device.";
      }

      setError({ type, message });
      setIsReady(false);
    }
  }, []);

  const capture = useCallback(() => {
    const video = videoRef.current;
    if (!video) return null;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    // Mirror the capture so it matches the "selfie" preview the user saw.
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.95);
  }, []);

  // Always release the camera when the owning component unmounts.
  useEffect(() => stop, [stop]);

  return { videoRef, isReady, error, start, stop, capture };
}
