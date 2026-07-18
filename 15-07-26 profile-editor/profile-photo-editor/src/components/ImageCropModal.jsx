import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";
import Button from "./Button";
import { loadImage, getVisibleCropRect, getCroppedImg, clamp } from "../utils/cropImage";
import { FILTERS, DEFAULT_FILTER } from "../utils/filters";

const CONTAINER_SIZE = 300; // px, diameter of the circular crop region (used for crop math)
const VIEWPORT_SIZE = 340; // px, the outer pannable square — larger than the circle so corners show the dark scrim
const MIN_ZOOM = 1;
const MAX_ZOOM = 5;

/**
 * ZoomSlider
 * ---------------------------------------------------------------------------
 * [ - ]  ---slider---  120%  [ + ]
 *
 * Only ever used inside <ImageCropModal />, so it lives here as a small
 * internal, "dumb" presentational unit rather than its own file.
 * ---------------------------------------------------------------------------
 */
function ZoomSlider({ zoom, min = MIN_ZOOM, max = MAX_ZOOM, step = 0.05, onChange }) {
  const stepBy = (delta) => {
    const next = Math.min(max, Math.max(min, +(zoom + delta).toFixed(2)));
    onChange(next);
  };

  return (
    <div className="pe-zoom-controls flex items-center gap-3 px-1">
      <button
        type="button"
        onClick={() => stepBy(-0.2)}
        disabled={zoom <= min}
        aria-label="Zoom out"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-150 hover:bg-white/20 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
          <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={zoom}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="pe-zoom-slider h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-white/15 accent-emerald-400"
        aria-label="Zoom level"
      />

      <button
        type="button"
        onClick={() => stepBy(0.2)}
        disabled={zoom >= max}
        aria-label="Zoom in"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-150 hover:bg-white/20 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <span className="pe-zoom-readout w-12 shrink-0 text-right text-xs font-semibold tabular-nums text-slate-300">
        {Math.round(zoom * 100)}%
      </span>
    </div>
  );
}

ZoomSlider.propTypes = {
  zoom: PropTypes.number.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

/**
 * FilterStrip
 * ---------------------------------------------------------------------------
 * Horizontal, swipeable row of filter presets (Original, Bright, Contrast,
 * Warm, Cool, Vintage, Black & White). Each thumbnail is the actual selected
 * image with the candidate CSS filter applied, so users see a true live
 * preview — the same pattern Instagram uses beneath its crop tool.
 *
 * Only ever used inside <ImageCropModal />, so it lives here as an internal
 * component rather than its own file.
 * ---------------------------------------------------------------------------
 */
function FilterStrip({ imageSrc, activeFilterId, onSelect }) {
  return (
    <div className="pe-filter-row -mx-1 flex gap-3 overflow-x-auto px-1 pb-1 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {FILTERS.map((filter) => {
        const isActive = filter.id === activeFilterId;
        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onSelect(filter)}
            className="pe-filter-item flex shrink-0 flex-col items-center gap-1.5"
          >
            <span
              className={`block h-14 w-14 overflow-hidden rounded-full ring-2 transition-all duration-200 ${
                isActive
                  ? "ring-emerald-400 scale-105 shadow-lg shadow-emerald-500/20"
                  : "ring-transparent opacity-80 hover:opacity-100 hover:scale-105"
              }`}
            >
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  className="h-full w-full object-cover"
                  style={{ filter: filter.css }}
                />
              ) : (
                <span className="block h-full w-full bg-slate-700" />
              )}
            </span>
            <span
              className={`text-[11px] font-medium transition-colors duration-150 ${
                isActive ? "text-emerald-400" : "text-slate-400"
              }`}
            >
              {filter.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

FilterStrip.propTypes = {
  imageSrc: PropTypes.string,
  activeFilterId: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

/**
 * ImageCropModal
 * ---------------------------------------------------------------------------
 * The heart of the editor. Renders the raw image inside a fixed-size square
 * viewport with a circular mask + dark overlay outside the circle (WhatsApp /
 * Instagram style). The user can:
 *   - Drag (mouse or touch) to pan the image.
 *   - Use the zoom slider to scale from 1x–5x.
 *   - Pick a filter from the filter strip, previewed live.
 * On Save, the exact visible crop rectangle is computed in natural image
 * pixels and rendered to a circular PNG via utils/cropImage.js.
 * ---------------------------------------------------------------------------
 */
export default function ImageCropModal({ isOpen, imageSrc, onCancel, onSave }) {
  const [naturalSize, setNaturalSize] = useState(null); // { width, height }
  const [baseScale, setBaseScale] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const dragState = useRef({ dragging: false, startX: 0, startY: 0, origin: { x: 0, y: 0 } });
  const imgRef = useRef(null);

  // Reset editor state whenever a fresh image is loaded into the modal.
  useEffect(() => {
    if (!isOpen || !imageSrc) return;
    let cancelled = false;

    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setFilter(DEFAULT_FILTER);
    setPreviewUrl(null);

    loadImage(imageSrc).then((img) => {
      if (cancelled) return;
      const { naturalWidth, naturalHeight } = img;
      setNaturalSize({ width: naturalWidth, height: naturalHeight });
      // "Cover" fit: the image's shorter side exactly fills the crop circle.
      const cover = CONTAINER_SIZE / Math.min(naturalWidth, naturalHeight);
      setBaseScale(cover);
    });

    return () => {
      cancelled = true;
    };
  }, [isOpen, imageSrc]);

  const displayScale = baseScale * zoom;

  // Keep the pan offset within reasonable bounds so the circle is never left empty.
  const clampPosition = useCallback(
    (pos, currentZoom = zoom) => {
      if (!naturalSize) return pos;
      const scale = baseScale * currentZoom;
      const maxX = Math.max(0, (naturalSize.width * scale - CONTAINER_SIZE) / 2);
      const maxY = Math.max(0, (naturalSize.height * scale - CONTAINER_SIZE) / 2);
      return {
        x: clamp(pos.x, -maxX, maxX),
        y: clamp(pos.y, -maxY, maxY),
      };
    },
    [naturalSize, baseScale, zoom]
  );

  const handleZoomChange = (nextZoom) => {
    setZoom(nextZoom);
    setPosition((pos) => clampPosition(pos, nextZoom));
  };

  // ---- Pointer-based drag-to-pan (works for mouse + touch + pen) ----------
  const handlePointerDown = (e) => {
    dragState.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      origin: position,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragState.current.dragging) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    const next = {
      x: dragState.current.origin.x + dx,
      y: dragState.current.origin.y + dy,
    };
    setPosition(clampPosition(next));
  };

  const handlePointerUp = (e) => {
    dragState.current.dragging = false;
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  // Support mouse-wheel zoom for desktop users, in addition to the slider.
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    const next = clamp(+(zoom + delta).toFixed(2), MIN_ZOOM, MAX_ZOOM);
    handleZoomChange(next);
  };

  const cropRect = useMemo(() => {
    if (!naturalSize) return null;
    return getVisibleCropRect({
      naturalWidth: naturalSize.width,
      naturalHeight: naturalSize.height,
      baseScale,
      zoom,
      position,
      containerSize: CONTAINER_SIZE,
    });
  }, [naturalSize, baseScale, zoom, position]);

  // Recompute a small live preview thumbnail whenever crop/zoom/filter changes.
  useEffect(() => {
    if (!isOpen || !imageSrc || !cropRect) return undefined;
    let cancelled = false;

    const timeout = setTimeout(async () => {
      try {
        const dataUrl = await getCroppedImg(imageSrc, cropRect, filter.css, 160);
        if (!cancelled) setPreviewUrl(dataUrl);
      } catch {
        /* preview is best-effort; ignore transient errors while dragging */
      }
    }, 60); // small debounce keeps dragging smooth

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [isOpen, imageSrc, cropRect, filter]);

  const handleSave = async () => {
    if (!cropRect) return;
    setIsSaving(true);
    try {
      const finalDataUrl = await getCroppedImg(imageSrc, cropRect, filter.css, 512);
      onSave(finalDataUrl);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onCancel} variant="dialog" ariaLabel="Edit profile photo">
      <div className="flex flex-col items-center gap-5 p-5 sm:p-6">
        {/* ---- Crop viewport ----
            Outer square defines the pannable bounds (overflow-hidden).
            The circular "hole" is a transparent disc whose oversized
            box-shadow fills everything *outside* it with a dark scrim —
            the same technique WhatsApp/Instagram use, so the corners of
            the square are dimmed while the circle stays perfectly clear. */}
        <div
          className="pe-crop-viewport relative touch-none select-none overflow-hidden rounded-2xl bg-black shadow-inner shadow-black/70"
          style={{ width: VIEWPORT_SIZE, height: VIEWPORT_SIZE }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onWheel={handleWheel}
        >
          {imageSrc && naturalSize && (
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Selected"
              draggable={false}
              className="pe-crop-image absolute left-1/2 top-1/2 max-w-none cursor-grab active:cursor-grabbing"
              style={{
                width: naturalSize.width * displayScale,
                height: naturalSize.height * displayScale,
                transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`,
                filter: filter.css,
              }}
            />
          )}

          {/* Dark scrim outside the circular crop hole */}
          <div
            className="pe-crop-hole pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: CONTAINER_SIZE,
              height: CONTAINER_SIZE,
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.7)",
            }}
          />
          {/* Crisp ring outlining the exact crop circle, with a subtle glow */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-inset ring-white/85 shadow-[0_0_24px_rgba(52,211,153,0.25)]"
            style={{ width: CONTAINER_SIZE, height: CONTAINER_SIZE }}
          />
        </div>

        {/* ---- Live preview ---- */}
        <div className="flex items-center gap-3 text-slate-300">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Preview
          </span>
          <span className="h-12 w-12 overflow-hidden rounded-full ring-2 ring-white/15 shadow-md shadow-black/40">
            {previewUrl ? (
              <img src={previewUrl} alt="Live preview" className="h-full w-full object-cover" />
            ) : (
              <span className="block h-full w-full animate-pulse bg-slate-700" />
            )}
          </span>
        </div>

        {/* ---- Zoom ---- */}
        <div className="w-full max-w-xs">
          <ZoomSlider zoom={zoom} min={MIN_ZOOM} max={MAX_ZOOM} onChange={handleZoomChange} />
        </div>

        {/* ---- Filters ---- */}
        <div className="w-full max-w-xs">
          <FilterStrip
            imageSrc={imageSrc}
            activeFilterId={filter.id}
            onSelect={setFilter}
          />
        </div>

        {/* ---- Actions ---- */}
        <div className="flex w-full max-w-xs items-center gap-3 pt-1">
          <Button variant="secondary" fullWidth onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button variant="primary" fullWidth onClick={handleSave} loading={isSaving}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}

ImageCropModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  imageSrc: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
