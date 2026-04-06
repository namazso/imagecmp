'use client';

import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import type { ScaleMode, Alignment, ImageRenderingMode } from '@/lib/types';
import { useKeyboard } from '@/hooks/useKeyboard';

interface Props {
  urls: string[];
  sources: string[];
  activeSource: number;
  setActiveSource: (i: number) => void;
  checkedSources: boolean[];
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

export function ClickerMode({
  urls,
  sources,
  activeSource,
  setActiveSource,
  checkedSources,
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

  const navigateChecked = useCallback(
    (direction: 1 | -1) => {
      const count = sources.length;
      if (count === 0) return;
      for (let step = 1; step < count; step++) {
        const idx = ((activeSource + direction * step) % count + count) % count;
        if (checkedSources[idx]) {
          setActiveSource(idx);
          return;
        }
      }
    },
    [activeSource, checkedSources, sources.length, setActiveSource],
  );

  const keyMap = useMemo(() => {
    const map: Record<string, () => void> = {
      ArrowRight: () => navigateChecked(1),
      ArrowLeft: () => navigateChecked(-1),
      ArrowDown: () => setSceneIndex((sceneIndex + 1) % sceneCount),
      ArrowUp: () => setSceneIndex((sceneIndex - 1 + sceneCount) % sceneCount),
    };
    for (let i = 1; i <= 9; i++) {
      const idx = i - 1;
      if (idx < sources.length) {
        map[String(i)] = () => setActiveSource(idx);
      }
    }
    return map;
  }, [sources.length, setActiveSource, navigateChecked, sceneIndex, sceneCount, setSceneIndex]);

  useKeyboard(keyMap);

  const url = urls[activeSource] ?? '';
  const imgStyle = useImageStyle(scaleMode, url, urls, dimensions, containerSize);

  const needsScroll = scaleMode === '1:1';

  if (!loaded) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="animate-pulse text-neutral-400">Loading images…</p>
      </div>
    );
  }

  if (!url) {
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
      onClick={() => navigateChecked(1)}
    >
      {urls.map((u, i) => {
        if (!u) return null;
        const isActive = i === activeSource;
        return (
          <img
            key={i}
            src={u}
            alt={sources[i] ?? ''}
            draggable={false}
            className="block max-w-none"
            style={
              isActive
                ? { ...imgStyle, imageRendering: rendering }
                : { position: 'absolute', visibility: 'hidden', pointerEvents: 'none' }
            }
          />
        );
      })}
    </div>
  );
}

/**
 * Computes the inline style for an image based on scale mode,
 * the image's own dimensions, sibling dimensions, and container size.
 */
function useImageStyle(
  scaleMode: ScaleMode,
  url: string,
  allUrls: string[],
  dimensions: Map<string, { width: number; height: number }>,
  containerSize: { width: number; height: number },
): React.CSSProperties {
  return useMemo(() => {
    const dim = url ? dimensions.get(url) : undefined;

    switch (scaleMode) {
      case '1:1':
        return dim ? { width: dim.width, height: dim.height } : {};

      case 'fit-largest-height': {
        let maxH = 0;
        for (const u of allUrls) {
          const d = dimensions.get(u);
          if (d && d.height > maxH) maxH = d.height;
        }
        return maxH > 0 ? { height: maxH, width: 'auto' } : {};
      }

      case 'fit-largest-width': {
        let maxW = 0;
        for (const u of allUrls) {
          const d = dimensions.get(u);
          if (d && d.width > maxW) maxW = d.width;
        }
        return maxW > 0 ? { width: maxW, height: 'auto' } : {};
      }

      case 'fit-canvas-height':
        return { height: containerSize.height, width: 'auto' };

      case 'fit-canvas-width':
        return { width: containerSize.width, height: 'auto' };

      case 'fill-canvas-height':
        return { minHeight: containerSize.height, width: 'auto' };

      case 'fill-canvas-width':
        return { minWidth: containerSize.width, height: 'auto' };

      default:
        return {};
    }
  }, [scaleMode, url, allUrls, dimensions, containerSize]);
}
