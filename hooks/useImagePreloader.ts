'use client';

import { useState, useEffect, useRef } from 'react';

interface PreloaderState {
  /** True once all images in the current URL set have loaded (or errored) */
  loaded: boolean;
  /** Maps URL → { naturalWidth, naturalHeight } for successfully loaded images */
  dimensions: Map<string, { width: number; height: number }>;
}

/**
 * Preloads an array of image URLs and reports when all have settled.
 * Resets when the URL array changes (by value, not reference).
 */
export function useImagePreloader(urls: string[]): PreloaderState {
  const [state, setState] = useState<PreloaderState>({
    loaded: false,
    dimensions: new Map(),
  });

  // Track the serialized key to detect real changes
  const keyRef = useRef('');

  useEffect(() => {
    const key = JSON.stringify(urls);
    if (key === keyRef.current) return;
    keyRef.current = key;

    // Filter empty URLs — they're not loadable
    const validUrls = urls.filter((u) => u.length > 0);

    if (validUrls.length === 0) {
      setState({ loaded: true, dimensions: new Map() });
      return;
    }

    let cancelled = false;
    const dims = new Map<string, { width: number; height: number }>();
    let settled = 0;

    setState({ loaded: false, dimensions: new Map() });

    const check = () => {
      settled++;
      if (!cancelled && settled >= validUrls.length) {
        setState({ loaded: true, dimensions: new Map(dims) });
      }
    };

    for (const url of validUrls) {
      const img = new Image();
      img.onload = () => {
        dims.set(url, { width: img.naturalWidth, height: img.naturalHeight });
        check();
      };
      img.onerror = () => {
        check();
      };
      img.src = url;
    }

    return () => {
      cancelled = true;
    };
  }, [urls]);

  return state;
}
