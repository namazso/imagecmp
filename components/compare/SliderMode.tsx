'use client';

import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import type { ScaleMode, Alignment, ImageRenderingMode, SliderOrientation } from '@/lib/types';
import { useKeyboard } from '@/hooks/useKeyboard';

interface Props {
  urls: string[];
  sources: string[];
  sourceA: number;
  sourceB: number;
  setSourceA: (i: number) => void;
  setSourceB: (i: number) => void;
  orientation: SliderOrientation;
  dimensions: Map<string, { width: number; height: number }>;
  scaleMode: ScaleMode;
  alignment: Alignment;
  rendering: ImageRenderingMode;
  loaded: boolean;
  sceneIndex: number;
  sceneCount: number;
  setSceneIndex: (i: number) => void;
}

const ALIGNMENT_CLASSES: Record<Alignment, string> = {
  center: 'items-center justify-center',
  left: 'items-center justify-start',
  right: 'items-center justify-end',
  top: 'items-start justify-center',
  bottom: 'items-end justify-center',
  'top-left': 'items-start justify-start',
  'top-right': 'items-start justify-end',
  'bottom-left': 'items-end justify-start',
  'bottom-right': 'items-end justify-end',
};

const B_KEYS = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];

export function SliderMode({
  urls,
  sources,
  sourceA,
  sourceB,
  setSourceA,
  setSourceB,
  orientation,
  dimensions,
  scaleMode,
  alignment,
  rendering,
  loaded,
  sceneIndex,
  sceneCount,
  setSceneIndex,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [sliderPos, setSliderPos] = useState(0.5);
  const dragging = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Keyboard shortcuts: 1-9 for sourceA, q-p for sourceB
  const keyMap = useMemo(() => {
    const map: Record<string, () => void> = {
      ArrowDown: () => setSceneIndex((sceneIndex + 1) % sceneCount),
      ArrowUp: () => setSceneIndex((sceneIndex - 1 + sceneCount) % sceneCount),
    };
    for (let i = 1; i <= 9; i++) {
      const idx = i - 1;
      if (idx < sources.length) {
        map[String(i)] = () => setSourceA(idx);
      }
    }
    for (let i = 0; i < B_KEYS.length; i++) {
      if (i < sources.length) {
        const idx = i;
        map[B_KEYS[i]] = () => setSourceB(idx);
      }
    }
    return map;
  }, [sources.length, setSourceA, setSourceB, sceneIndex, sceneCount, setSceneIndex]);

  useKeyboard(keyMap);

  const urlA = urls[sourceA] ?? '';
  const urlB = urls[sourceB] ?? '';

  const imgStyle = useSliderImageStyle(scaleMode, urlA, urlB, urls, dimensions, containerSize);

  const clipPath =
    orientation === 'vertical'
      ? `inset(0 0 0 ${sliderPos * 100}%)`
      : `inset(${sliderPos * 100}% 0 0 0)`;

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      let pos: number;
      if (orientation === 'vertical') {
        pos = (e.clientX - rect.left) / rect.width;
      } else {
        pos = (e.clientY - rect.top) / rect.height;
      }
      setSliderPos(Math.max(0, Math.min(1, pos)));
    },
    [orientation],
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    dragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  const needsScroll = scaleMode === '1:1';

  if (!loaded) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="animate-pulse text-neutral-400">Loading images…</p>
      </div>
    );
  }

  if (!urlA && !urlB) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-neutral-500">No image URL provided</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative flex h-full w-full ${ALIGNMENT_CLASSES[alignment]} ${needsScroll ? 'overflow-auto' : 'overflow-hidden'}`}
      style={{ touchAction: 'none' }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Wrapper to position images absolutely within */}
      <div className="relative" style={imgStyle.wrapper}>
        {/* Image A — base layer */}
        <img
          src={urlA}
          alt={sources[sourceA] ?? 'A'}
          draggable={false}
          className="block max-w-none"
          style={{ ...imgStyle.img, imageRendering: rendering }}
        />

        {/* Image B — clipped overlay */}
        <img
          src={urlB}
          alt={sources[sourceB] ?? 'B'}
          draggable={false}
          className="absolute left-0 top-0 block max-w-none"
          style={{
            ...imgStyle.img,
            imageRendering: rendering,
            clipPath,
          }}
        />

        {/* Slider line + handle */}
        {orientation === 'vertical' ? (
          <div
            className="absolute top-0 z-20"
            style={{
              left: `${sliderPos * 100}%`,
              height: '100%',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="h-full w-0.5 bg-white/80" />
            <div
              className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-col-resize rounded-full border-2 border-white bg-white/30 shadow-lg"
              onPointerDown={handlePointerDown}
            />
          </div>
        ) : (
          <div
            className="absolute left-0 z-20"
            style={{
              top: `${sliderPos * 100}%`,
              width: '100%',
              transform: 'translateY(-50%)',
            }}
          >
            <div className="h-0.5 w-full bg-white/80" />
            <div
              className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-row-resize rounded-full border-2 border-white bg-white/30 shadow-lg"
              onPointerDown={handlePointerDown}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Compute both a wrapper size and an img size for the two-image overlay.
 * The wrapper is relatively positioned to contain both absolutely positioned images.
 */
function useSliderImageStyle(
  scaleMode: ScaleMode,
  urlA: string,
  urlB: string,
  allUrls: string[],
  dimensions: Map<string, { width: number; height: number }>,
  containerSize: { width: number; height: number },
): { wrapper: React.CSSProperties; img: React.CSSProperties } {
  return useMemo(() => {
    // For overlay, both images share the same size style
    const dimA = urlA ? dimensions.get(urlA) : undefined;

    switch (scaleMode) {
      case '1:1': {
        const w = dimA?.width;
        const h = dimA?.height;
        return {
          wrapper: w && h ? { width: w, height: h } : {},
          img: w && h ? { width: w, height: h } : {},
        };
      }

      case 'fit-largest-height': {
        let maxH = 0;
        for (const u of allUrls) {
          const d = dimensions.get(u);
          if (d && d.height > maxH) maxH = d.height;
        }
        // Compute wrapper width from image A's aspect ratio at maxH
        const wrapW = dimA && maxH > 0 ? (dimA.width / dimA.height) * maxH : undefined;
        return {
          wrapper: maxH > 0 && wrapW ? { width: wrapW, height: maxH } : {},
          img: maxH > 0 ? { height: maxH, width: 'auto' } : {},
        };
      }

      case 'fit-largest-width': {
        let maxW = 0;
        for (const u of allUrls) {
          const d = dimensions.get(u);
          if (d && d.width > maxW) maxW = d.width;
        }
        const wrapH = dimA && maxW > 0 ? (dimA.height / dimA.width) * maxW : undefined;
        return {
          wrapper: maxW > 0 && wrapH ? { width: maxW, height: wrapH } : {},
          img: maxW > 0 ? { width: maxW, height: 'auto' } : {},
        };
      }

      case 'fit-canvas-height': {
        const h = containerSize.height;
        const w = dimA && dimA.height > 0 ? (dimA.width / dimA.height) * h : undefined;
        return {
          wrapper: w ? { width: w, height: h } : { height: h },
          img: { height: h, width: 'auto' },
        };
      }

      case 'fit-canvas-width': {
        const w = containerSize.width;
        const h = dimA && dimA.width > 0 ? (dimA.height / dimA.width) * w : undefined;
        return {
          wrapper: h ? { width: w, height: h } : { width: w },
          img: { width: w, height: 'auto' },
        };
      }

      case 'fill-canvas-height': {
        const h = containerSize.height;
        const w = dimA && dimA.height > 0 ? (dimA.width / dimA.height) * h : undefined;
        return {
          wrapper: w ? { width: w, minHeight: h } : { minHeight: h },
          img: { minHeight: h, width: 'auto' },
        };
      }

      case 'fill-canvas-width': {
        const w = containerSize.width;
        const h = dimA && dimA.width > 0 ? (dimA.height / dimA.width) * w : undefined;
        return {
          wrapper: h ? { minWidth: w, height: h } : { minWidth: w },
          img: { minWidth: w, height: 'auto' },
        };
      }

      default:
        return { wrapper: {}, img: {} };
    }
  }, [scaleMode, urlA, allUrls, dimensions, containerSize]);
}
