'use client';

import type {
  Gallery,
  CompareMode,
  ScaleMode,
  Alignment,
  ImageRenderingMode,
  SliderOrientation,
} from '@/lib/types';
import { OptionsPanel } from './OptionsPanel';
import { HelpTooltip } from './HelpTooltip';
import Link from 'next/link';
import { SITE_NAME } from '@/lib/types';
import { encodeGallery } from '@/lib/codec';

interface Props {
  gallery: Gallery;
  sceneIndex: number;
  setSceneIndex: (i: number) => void;
  mode: CompareMode;
  setMode: (m: CompareMode) => void;
  clickerSource: number;
  setClickerSource: (i: number) => void;
  checkedSources: boolean[];
  setCheckedSources: (c: boolean[]) => void;
  sliderSourceA: number;
  setSliderSourceA: (i: number) => void;
  sliderSourceB: number;
  setSliderSourceB: (i: number) => void;
  sliderOrientation: SliderOrientation;
  setSliderOrientation: (o: SliderOrientation) => void;
  scaleMode: ScaleMode;
  setScaleMode: (s: ScaleMode) => void;
  alignment: Alignment;
  setAlignment: (a: Alignment) => void;
  rendering: ImageRenderingMode;
  setRendering: (r: ImageRenderingMode) => void;
}

export function TopBar({
  gallery,
  sceneIndex,
  setSceneIndex,
  mode,
  setMode,
  clickerSource,
  setClickerSource,
  checkedSources,
  setCheckedSources,
  sliderSourceA,
  setSliderSourceA,
  sliderSourceB,
  setSliderSourceB,
  sliderOrientation,
  setSliderOrientation,
  scaleMode,
  setScaleMode,
  alignment,
  setAlignment,
  rendering,
  setRendering,
}: Props) {
  const toggleMode = () => setMode(mode === 'clicker' ? 'slider' : 'clicker');

  const toggleCheck = (idx: number) => {
    const checkedCount = checkedSources.filter(Boolean).length;
    // Prevent unchecking the last checked source
    if (checkedSources[idx] && checkedCount <= 1) return;
    const next = [...checkedSources];
    next[idx] = !next[idx];
    setCheckedSources(next);
  };

  return (
    <div className="flex items-center gap-4 border-b border-neutral-800 bg-neutral-900 px-4 py-2">
      <Link href="/" className="text-sm font-bold text-neutral-100 hover:text-white">
        {SITE_NAME}
      </Link>

      {/* Scene selector */}
      {gallery.scenes.length > 1 && (
        <select
          value={sceneIndex}
          onChange={(e) => setSceneIndex(Number(e.target.value))}
          className="rounded bg-neutral-800 px-2 py-1 text-sm text-neutral-100"
        >
          {gallery.scenes.map((name, i) => (
            <option key={i} value={i}>
              {name}
            </option>
          ))}
        </select>
      )}

      {/* Mode toggle */}
      <button
        onClick={toggleMode}
        className="rounded bg-neutral-700 px-3 py-1 text-sm hover:bg-neutral-600"
      >
        {mode === 'clicker' ? 'Clicker' : 'Slider'}
      </button>

      <HelpTooltip />

      {/* Source selectors */}
      {mode === 'clicker' ? (
        <div className="flex items-center gap-1">
          {gallery.sources.map((name, i) => (
            <button
              key={i}
              onClick={() => {
                if (clickerSource === i) {
                  // Clicking the active source toggles its check
                  toggleCheck(i);
                } else {
                  setClickerSource(i);
                }
              }}
              className={`flex items-center gap-1.5 rounded px-2 py-1 text-sm ${
                clickerSource === i
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              <span
                className={`inline-block h-3 w-3 rounded-sm border ${
                  checkedSources[i]
                    ? 'border-blue-400 bg-blue-500'
                    : 'border-neutral-500 bg-neutral-700'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCheck(i);
                }}
              />
              {name}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-3 text-sm">
          <label className="flex items-center gap-1">
            A:
            <select
              value={sliderSourceA}
              onChange={(e) => setSliderSourceA(Number(e.target.value))}
              className="rounded bg-neutral-800 px-2 py-1 text-neutral-100"
            >
              {gallery.sources.map((name, i) => (
                <option key={i} value={i}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-1">
            B:
            <select
              value={sliderSourceB}
              onChange={(e) => setSliderSourceB(Number(e.target.value))}
              className="rounded bg-neutral-800 px-2 py-1 text-neutral-100"
            >
              {gallery.sources.map((name, i) => (
                <option key={i} value={i}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Options */}
      <OptionsPanel
        mode={mode}
        sliderOrientation={sliderOrientation}
        setSliderOrientation={setSliderOrientation}
        scaleMode={scaleMode}
        setScaleMode={setScaleMode}
        alignment={alignment}
        setAlignment={setAlignment}
        rendering={rendering}
        setRendering={setRendering}
      />
      <Link
        href={`/create#${encodeGallery(gallery)}`}
        className="rounded bg-neutral-700 px-3 py-1 text-sm hover:bg-neutral-600"
      >
        Edit
      </Link>
    </div>
  );
}
