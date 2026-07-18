/**
 * Central app configuration.
 *
 * BASE_URL is the ONLY thing you need to change when your laptop's IP
 * address changes. Every QR code is generated as:
 *
 *   ${BASE_URL}/employee/{employeeId}
 *
 * How to find your local IP:
 *   Windows -> ipconfig            (look for "IPv4 Address")
 *   macOS   -> ipconfig getifaddr en0
 *   Linux   -> hostname -I
 *
 * Then make sure `npm run dev -- --host` (or the "dev" script) is
 * exposing Vite on your network, and phones are on the same Wi-Fi.
 */
export const BASE_URL = 'http://192.168.200.74:5173';
