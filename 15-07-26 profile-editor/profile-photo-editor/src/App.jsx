import React, { useState } from "react";
import { ProfileEditor } from "./components";

/**
 * Demo / usage example.
 *
 * Try the two prop combinations mentioned in the brief:
 *   <ProfileEditor takePhoto={true}  uploadPhoto={true} />   -> both options
 *   <ProfileEditor takePhoto={false} uploadPhoto={true} />   -> upload only
 */
export default function App() {
  const [savedPhoto, setSavedPhoto] = useState(null);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#0f1115] p-6">
      <div className="flex flex-col items-center gap-6 rounded-3xl bg-[#15181d] p-10 shadow-2xl">
        <h1 className="text-lg font-semibold text-white">Edit profile photo</h1>

        <ProfileEditor
          takePhoto={true}
          uploadPhoto={true}
          size={168}
          onChange={(dataUrl) => setSavedPhoto(dataUrl)}
        />

        <p className="max-w-xs text-center text-sm text-slate-400">
          Tap the avatar above to take a new photo or upload one from your
          device, then drag, zoom, and apply a filter before saving.
        </p>

        {savedPhoto && (
          <p className="text-xs text-emerald-400">✓ Profile photo updated</p>
        )}
      </div>
    </div>
  );
}
