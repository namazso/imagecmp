'use client';

import { useState, useEffect, useCallback, useRef, Fragment } from 'react';
import type { Gallery } from '@/lib/types';
import { encodeGallery, decodeGallery } from '@/lib/codec';

function readInitialGallery(): Gallery | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash.slice(1);
  if (!hash) return null;
  return decodeGallery(hash);
}

const INPUT_CLASS =
  'bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full';

const URL_INPUT_CLASS =
  'bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full';

export function GalleryForm() {
  const initialGallery = useRef(readInitialGallery()).current;
  const [title, setTitle] = useState(initialGallery?.title ?? '');
  const [sources, setSources] = useState<string[]>(initialGallery?.sources ?? ['Source 1', 'Source 2']);
  const [scenes, setScenes] = useState<string[]>(initialGallery?.scenes ?? ['Scene 1']);
  const [urls, setUrls] = useState<string[][]>(initialGallery?.urls ?? [['', '']]);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Debounced link generation
  useEffect(() => {
    const timer = setTimeout(() => {
      const gallery: Gallery = { title, sources, scenes, urls };
      const encoded = encodeGallery(gallery);
      setGeneratedLink(`${window.location.origin}/compare#${encoded}`);
      history.replaceState(null, '', `#${encoded}`);
    }, 300);
    return () => clearTimeout(timer);
  }, [title, sources, scenes, urls]);

  const updateUrl = useCallback(
    (sceneIdx: number, sourceIdx: number, value: string) => {
      setUrls((prev) => {
        const next = prev.map((row) => [...row]);
        next[sceneIdx][sourceIdx] = value;
        return next;
      });
    },
    [],
  );

  const updateSource = useCallback((idx: number, value: string) => {
    setSources((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  }, []);

  const updateScene = useCallback((idx: number, value: string) => {
    setScenes((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  }, []);

  const addSource = useCallback(() => {
    setSources((prev) => [...prev, `Source ${prev.length + 1}`]);
    setUrls((prev) => prev.map((row) => [...row, '']));
  }, []);

  const removeSource = useCallback((idx: number) => {
    setSources((prev) => prev.filter((_, i) => i !== idx));
    setUrls((prev) => prev.map((row) => row.filter((_, i) => i !== idx)));
  }, []);

  const addScene = useCallback(() => {
    setScenes((prev) => [...prev, `Scene ${prev.length + 1}`]);
    setUrls((prev) => [...prev, Array<string>(sources.length).fill('')]);
  }, [sources.length]);

  const removeScene = useCallback((idx: number) => {
    setScenes((prev) => prev.filter((_, i) => i !== idx));
    setUrls((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(false), 2000);
  }, [generatedLink]);

  // Cleanup timer on unmount
  useEffect(() => () => clearTimeout(copiedTimer.current), []);

  const canDelete = sources.length > 2;
  const canDeleteScene = scenes.length > 1;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <h1 className="text-3xl font-bold text-neutral-100">Create Gallery</h1>

      {/* Gallery title */}
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-300">
          Gallery Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Comparison"
          className={INPUT_CLASS}
        />
      </div>

      {/* Matrix */}
      <div className="overflow-x-auto">
        <div
          className="gap-2"
          style={{
            display: 'grid',
            gridTemplateColumns: `auto repeat(${sources.length}, minmax(200px, 1fr))`,
          }}
        >
          {/* Top-left empty cell */}
          <div />

          {/* Source column headers */}
          {sources.map((source, sIdx) => (
            <div key={sIdx} className="relative">
              <input
                type="text"
                value={source}
                onChange={(e) => updateSource(sIdx, e.target.value)}
                className={INPUT_CLASS + ' pr-7 text-sm font-medium'}
              />
              {canDelete && (
                <button
                  type="button"
                  onClick={() => removeSource(sIdx)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-red-400"
                  aria-label={`Remove ${source}`}
                >
                  ×
                </button>
              )}
            </div>
          ))}

          {/* Scene rows */}
          {scenes.map((scene, scIdx) => (
            <Fragment key={scIdx}>
              {/* Row header: scene name */}
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={scene}
                  onChange={(e) => updateScene(scIdx, e.target.value)}
                  className={INPUT_CLASS + ' pr-7 text-sm font-medium'}
                />
                {canDeleteScene && (
                  <button
                    type="button"
                    onClick={() => removeScene(scIdx)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-red-400"
                    aria-label={`Remove ${scene}`}
                  >
                    ×
                  </button>
                )}
              </div>

              {/* URL cells */}
              {sources.map((_, soIdx) => (
                <input
                  key={`url-${scIdx}-${soIdx}`}
                  type="text"
                  value={urls[scIdx]?.[soIdx] ?? ''}
                  onChange={(e) => updateUrl(scIdx, soIdx, e.target.value)}
                  placeholder="https://..."
                  className={URL_INPUT_CLASS}
                />
              ))}
            </Fragment>
          ))}
        </div>
      </div>

      {/* Add buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={addSource}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          Add Source
        </button>
        <button
          type="button"
          onClick={addScene}
          className="rounded bg-neutral-700 px-4 py-2 text-sm font-medium text-neutral-100 hover:bg-neutral-600"
        >
          Add Scene
        </button>
      </div>

      {/* Generated link */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-300">
          Share Link
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={generatedLink}
            className={INPUT_CLASS + ' flex-1'}
          />
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}
