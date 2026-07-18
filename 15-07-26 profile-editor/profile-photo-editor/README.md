# Profile Photo Editor

A reusable, WhatsApp/Instagram-inspired **profile photo editor** for React —
avatar trigger → Take Photo / Upload Photo sheet → drag/zoom/filter crop
modal → circular avatar output.

```jsx
<ProfileEditor takePhoto={true} uploadPhoto={true} />
```

## ✨ Features

- Circular avatar with camera-badge overlay, opens a bottom sheet on tap.
- Sheet options (**Take Photo**, **Upload Photo**, **Remove Photo**) render
  dynamically based on props — no dead UI for disabled features.
- **Upload**: native file picker restricted to JPG / JPEG / PNG / WEBP, with
  friendly validation errors.
- **Take Photo**: live camera preview (`getUserMedia`) with a circular
  framing guide and shutter capture.
- **Crop modal**: drag-to-pan (mouse, touch & pen via Pointer Events),
  1x–5x zoom (buttons + slider + mouse wheel), 7 live filter presets, and a
  real-time circular preview — all rendered onto a canvas as a transparent
  circular PNG on Save.
- Dark glassmorphism UI, rounded corners, soft shadows, smooth
  animations, keyboard support (Escape to close, focus trapping) and
  `prefers-reduced-motion` support.
- Fully controlled via props; the parent only needs `onChange(dataUrl)`.

## 📦 Run the demo

This is a complete, runnable **Vite + React + Tailwind** project.

```bash
npm install
npm run dev
```

Then open the printed local URL (e.g. `http://localhost:5173`). `npm run build`
produces a production build in `dist/`.

## 🧩 Using it in your own app

Everything under `src/components`, `src/hooks`, and `src/utils` is
framework-agnostic — copy that folder into any existing React + Tailwind
project. You only need:

```bash
npm install react react-dom prop-types
```

...and Tailwind CSS configured (this repo's `tailwind.config.js` /
`postcss.config.js` / `src/styles/tailwind.css` show a minimal setup you can
copy if you don't have Tailwind yet). Also copy `src/styles/profile-editor.css`
for the keyframes and slider-thumb styling — it's the one hand-written
stylesheet the components depend on.

## 🚀 Usage

```jsx
import { ProfileEditor } from "./components";
import "./styles/profile-editor.css";

function SettingsPage() {
  return (
    <ProfileEditor
      takePhoto={true}
      uploadPhoto={true}
      size={168}
      onChange={(dataUrl) => saveAvatarToServer(dataUrl)}
    />
  );
}
```

Only want uploads (e.g. desktop-only web app with no camera flow)?

```jsx
<ProfileEditor takePhoto={false} uploadPhoto={true} />
```

## 🔧 Props — `<ProfileEditor />`

| Prop           | Type       | Default | Description                                              |
|----------------|------------|---------|------------------------------------------------------------|
| `takePhoto`    | `bool`     | `true`  | Show "Take Photo" and enable the camera flow.             |
| `uploadPhoto`  | `bool`     | `true`  | Show "Upload Photo" and enable the file picker.            |
| `allowRemove`  | `bool`     | `true`  | Show "Remove Photo" once an avatar is set.                 |
| `initialImage` | `string`   | `null`  | Existing avatar URL/data URL to display initially.         |
| `size`         | `number`   | `160`   | Avatar diameter in pixels.                                  |
| `onChange`     | `function` | —       | Called with the final circular PNG data URL, or `null`.    |

## 🗂 Folder structure

```
profile-photo-editor/
├── package.json                  # dependencies + npm scripts (dev/build/preview)
├── vite.config.js                # Vite + React plugin config
├── tailwind.config.js            # Tailwind content paths
├── postcss.config.js             # Tailwind/autoprefixer pipeline
├── index.html                    # Vite HTML entry point
└── src/
    ├── App.jsx                       # demo usage
    ├── main.jsx                      # React DOM root, mounts <App />
    ├── components/
    │   ├── ProfileEditor.jsx         # top-level orchestrator (state + wiring)
    │   ├── ProfileAvatar.jsx         # circular avatar + camera badge trigger
    │   ├── PhotoOptionsModal.jsx     # dynamic Take/Upload/Remove sheet
    │   ├── CameraCaptureModal.jsx    # getUserMedia preview + shutter
    │   ├── ImageCropModal.jsx        # drag / zoom / filter / crop + save
    │   ├── ZoomControls.jsx          # [-] slider [+] percentage
    │   ├── FilterControls.jsx        # horizontal filter picker w/ live thumbs
    │   ├── Button.jsx                # shared button primitive
    │   ├── Modal.jsx                 # shared sheet/dialog shell
    │   └── index.js                  # barrel export
    ├── hooks/
    │   └── useCamera.js              # getUserMedia lifecycle hook
    ├── utils/
    │   ├── cropImage.js              # crop-rect math + canvas export
    │   └── filters.js                # filter preset definitions
    └── styles/
        ├── tailwind.css              # @tailwind base/components/utilities
        └── profile-editor.css        # keyframes + slider thumb only
```

## 🧠 How cropping works

`ImageCropModal` renders the image inside a square, `overflow: hidden`
viewport. A separate transparent circular div uses an oversized
`box-shadow` to darken everything **outside** the circle — the same trick
WhatsApp/Instagram use — so dragging feels natural across the whole square
while only the circular region will actually be exported.

On every pan/zoom/filter change, `utils/cropImage.js#getVisibleCropRect`
converts the current zoom + pan (screen pixels) back into a rectangle in the
**original image's natural pixel coordinates**. `getCroppedImg` then draws
that exact rectangle onto an offscreen canvas clipped to a circle, applies
the chosen CSS filter at draw time, and returns a PNG data URL — used both
for the small live preview (debounced, 160px) and the final save (512px).

## ♿ Accessibility

- Modals trap focus, close on `Escape`, and restore body scroll on close.
- All interactive controls have `aria-label`s and visible focus rings.
- Respects `prefers-reduced-motion`.

## 🎨 Design notes

Dark, glassy theme (`#1c1f24` panels over `#0f1115`) with a single emerald
accent — evokes WhatsApp's green without copying its exact palette or
iconography. Sheets slide up from the bottom on mobile and pop in as
centered dialogs on desktop, per Material 3 / Apple HIG sheet conventions.
