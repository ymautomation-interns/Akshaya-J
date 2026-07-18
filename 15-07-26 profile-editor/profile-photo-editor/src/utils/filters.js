/**
 * filters.js
 * ---------------------------------------------------------------------------
 * Central list of the filter presets offered in the editor. Kept as plain
 * data so designers / product can add or reorder filters without touching
 * component logic. `css` is applied live (preview) via the `filter` CSS
 * property, and also fed into the canvas `ctx.filter` at export time.
 * ---------------------------------------------------------------------------
 */
export const FILTERS = [
  { id: "original", label: "Original", css: "none" },
  { id: "bright", label: "Bright", css: "brightness(1.25) saturate(1.05)" },
  { id: "contrast", label: "Contrast", css: "contrast(1.35) saturate(1.05)" },
  { id: "warm", label: "Warm", css: "sepia(0.35) saturate(1.3) brightness(1.03)" },
  { id: "cool", label: "Cool", css: "hue-rotate(-12deg) saturate(1.15) brightness(1.02)" },
  { id: "vintage", label: "Vintage", css: "sepia(0.45) contrast(0.9) brightness(1.05) saturate(0.75)" },
  { id: "bw", label: "Black & White", css: "grayscale(1) contrast(1.1)" },
];

export const DEFAULT_FILTER = FILTERS[0];
