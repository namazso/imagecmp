'use client';

import { useState, useEffect, useRef } from 'react';
import type {
  CompareMode,
  ScaleMode,
  Alignment,
  ImageRenderingMode,
  SliderOrientation,
} from '@/lib/types';
import {
  SCALE_MODE_LABELS,
  ALIGNMENT_LABELS,
  IMAGE_RENDERING_LABELS,
} from '@/lib/types';

interface Props {
  mode: CompareMode;
  sliderOrientation: SliderOrientation;
  setSliderOrientation: (o: SliderOrientation) => void;
  scaleMode: ScaleMode;
  setScaleMode: (s: ScaleMode) => void;
  alignment: Alignment;
  setAlignment: (a: Alignment) => void;
  rendering: ImageRenderingMode;
  setRendering: (r: ImageRenderingMode) => void;
}

export function OptionsPanel({
  mode,
  sliderOrientation,
  setSliderOrientation,
  scaleMode,
  setScaleMode,
  alignment,
  setAlignment,
  rendering,
  setRendering,
}: Props) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        className="rounded bg-neutral-700 px-3 py-1 text-sm hover:bg-neutral-600"
      >
        ⚙ Options
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-64 rounded-lg border border-neutral-700 bg-neutral-800 p-4 shadow-lg">
          <div className="flex flex-col gap-3">
            {/* Slider orientation — only in slider mode */}
            {mode === 'slider' && (
              <fieldset>
                <legend className="mb-1 text-xs font-medium text-neutral-400">
                  Slider Orientation
                </legend>
                <div className="flex gap-2">
                  {(['vertical', 'horizontal'] as const).map((o) => (
                    <button
                      key={o}
                      onClick={() => setSliderOrientation(o)}
                      className={`rounded px-2 py-1 text-xs ${
                        sliderOrientation === o
                          ? 'bg-blue-600 text-white'
                          : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                      }`}
                    >
                      {o === 'vertical' ? 'Vertical' : 'Horizontal'}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {/* Scaling */}
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-neutral-400">Scaling</span>
              <select
                value={scaleMode}
                onChange={(e) => setScaleMode(e.target.value as ScaleMode)}
                className="rounded bg-neutral-700 px-2 py-1 text-sm text-neutral-100"
              >
                {Object.entries(SCALE_MODE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            {/* Alignment */}
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-neutral-400">Alignment</span>
              <select
                value={alignment}
                onChange={(e) => setAlignment(e.target.value as Alignment)}
                className="rounded bg-neutral-700 px-2 py-1 text-sm text-neutral-100"
              >
                {Object.entries(ALIGNMENT_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            {/* Rendering */}
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-neutral-400">Rendering</span>
              <select
                value={rendering}
                onChange={(e) => setRendering(e.target.value as ImageRenderingMode)}
                className="rounded bg-neutral-700 px-2 py-1 text-sm text-neutral-100"
              >
                {Object.entries(IMAGE_RENDERING_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
