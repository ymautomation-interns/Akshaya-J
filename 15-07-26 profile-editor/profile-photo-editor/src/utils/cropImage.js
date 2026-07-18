/**
 * cropImage.js
 * ---------------------------------------------------------------------------
 * Pure helper utilities used by <ImageCropModal /> to turn a raw source image
 * plus the user's pan / zoom / filter choices into a final circular PNG.
 *
 * No React here on purpose — this is plain canvas math so it can be unit
 * tested in isolation from the UI.
 * ---------------------------------------------------------------------------
 */

/** Loads a URL/DataURL into an HTMLImageElement and resolves once it's ready. */
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // Needed so images picked from <input type="file"> / camera capture
    // (object URLs) never taint the canvas.
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Given the on-screen crop viewport (a fixed-size square), the natural image
 * dimensions, the current zoom level and pan offset, work out exactly which
 * rectangle of the *original* image is currently visible inside the circular
 * crop viewport.
 *
 * The math mirrors how the image is actually rendered in ImageCropModal:
 *   displayScale   = baseScale * zoom
 *   image top-left = containerCenter - (naturalSize * displayScale) / 2 + pan
 *
 * @returns {{x:number, y:number, width:number, height:number, displayScale:number}}
 */
export function getVisibleCropRect({
  naturalWidth,
  naturalHeight,
  baseScale,
  zoom,
  position,
  containerSize,
}) {
  const displayScale = baseScale * zoom;

  const imgLeft =
    containerSize / 2 - (naturalWidth * displayScale) / 2 + position.x;
  const imgTop =
    containerSize / 2 - (naturalHeight * displayScale) / 2 + position.y;

  const x = (0 - imgLeft) / displayScale;
  const y = (0 - imgTop) / displayScale;
  const width = containerSize / displayScale;
  const height = containerSize / displayScale;

  return { x, y, width, height, displayScale };
}

/**
 * Renders the cropped + filtered + circularly-masked result onto an offscreen
 * canvas and returns a PNG data URL ready to use as an avatar `src`.
 *
 * @param {string} imageSrc     source image (object URL or data URL)
 * @param {object} cropRect     result of getVisibleCropRect()
 * @param {string} cssFilter    a CSS/Canvas filter string, e.g. "grayscale(1)"
 * @param {number} outputSize   final square output size in pixels
 */
export async function getCroppedImg(
  imageSrc,
  cropRect,
  cssFilter = "none",
  outputSize = 512
) {
  const image = await loadImage(imageSrc);

  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;
  const ctx = canvas.getContext("2d");

  // Circular clip so anything outside the circle is fully transparent.
  ctx.save();
  ctx.beginPath();
  ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  // Apply the chosen filter (grayscale, warmth, contrast, etc.) at draw time.
  ctx.filter = cssFilter || "none";

  ctx.drawImage(
    image,
    cropRect.x,
    cropRect.y,
    cropRect.width,
    cropRect.height,
    0,
    0,
    outputSize,
    outputSize
  );

  ctx.restore();

  return canvas.toDataURL("image/png", 0.95);
}

/** Clamp helper reused across zoom / drag interactions. */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
