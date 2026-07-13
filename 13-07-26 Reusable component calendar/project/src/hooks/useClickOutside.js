// src/hooks/useClickOutside.js
import { useEffect } from "react";

/**
 * useClickOutside — calls `onOutsideClick` when a mousedown/touchstart
 * happens outside the given ref's element.
 *
 * Shared by Picker (closing the popup) and Selector (closing the
 * month/year dropdown) so this logic exists exactly once.
 *
 * @param {React.RefObject} ref - element that defines the "inside" area
 * @param {Function} onOutsideClick - called when a click lands outside
 * @param {boolean} active - only listens while true (perf + correctness)
 */
export default function useClickOutside(ref, onOutsideClick, active = true) {
  useEffect(() => {
    if (!active) return undefined;

    function handlePointerDown(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutsideClick(event);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [ref, onOutsideClick, active]);
}
