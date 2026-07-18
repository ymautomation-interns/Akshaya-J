/**
 * Utility helpers for QR code interactions: PNG export, printing, and clipboard copy.
 * Kept framework-agnostic so they can be reused by any component that renders an SVG QR code.
 */
import { BASE_URL } from '../config/appConfig';

/**
 * Converts an in-DOM SVG element into a downloadable PNG file.
 * @param {SVGElement} svgElement - The QR code's underlying <svg> node.
 * @param {string} fileName - Desired file name (without extension).
 * @param {number} scale - Upscale factor for crisper PNG output.
 */
export function downloadSvgAsPng(svgElement, fileName = 'qr-code', scale = 6) {
  if (!svgElement) return Promise.reject(new Error('No SVG element provided'));

  const xml = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const { width, height } = svgElement.getBoundingClientRect();
      const w = (width || 240) * scale;
      const h = (height || 240) * scale;

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');

      // White padding background so downloaded PNG is print-friendly.
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(image, 0, 0, w, h);
      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Canvas export failed'));
        const link = document.createElement('a');
        link.download = `${fileName}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
        setTimeout(() => URL.revokeObjectURL(link.href), 2000);
        resolve();
      }, 'image/png');
    };
    image.onerror = reject;
    image.src = url;
  });
}

/**
 * Opens a clean, print-only window containing the given SVG and a short label.
 * @param {SVGElement} svgElement
 * @param {{ name: string, employeeId: string }} employee
 */
export function printQrCode(svgElement, employee) {
  if (!svgElement) return;
  const xml = new XMLSerializer().serializeToString(svgElement);
  const printWindow = window.open('', '_blank', 'width=420,height=560');
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>${employee.name} · ${employee.employeeId}</title>
        <style>
          body {
            font-family: 'Segoe UI', system-ui, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            gap: 16px;
          }
          h1 { font-size: 18px; margin: 0; }
          p { margin: 0; color: #555; letter-spacing: 0.06em; }
          .qr-wrap { padding: 20px; border: 1px solid #e4e4e4; border-radius: 16px; }
        </style>
      </head>
      <body>
        <div class="qr-wrap">${xml}</div>
        <h1>${employee.name}</h1>
        <p>${employee.employeeId}</p>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 300);
}

/**
 * Copies text to the clipboard, with a fallback for older browsers.
 * @param {string} text
 * @returns {Promise<boolean>} whether the copy succeeded
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  } catch {
    return false;
  }
}

/**
 * Builds the value encoded inside every employee's QR code:
 *
 *   ${BASE_URL}/employee/{employeeId}
 *
 * BASE_URL comes from a single config file (src/config/appConfig.js), so
 * switching networks/laptops only ever requires editing one line.
 */
export function buildEmployeeQrValue(employeeId) {
  return `${BASE_URL}/employee/${String(employeeId).toUpperCase()}`;
}

/** Formats an ISO date string (e.g. 2021-03-15) into a readable label. */
export function formatDate(isoDate) {
  if (!isoDate) return '—';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Returns initials from a full name, used for avatar fallbacks. */
export function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}
