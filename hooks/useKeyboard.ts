'use client';

import { useEffect } from 'react';

/**
 * Registers global keydown listeners from a key → callback map.
 * Keys should match KeyboardEvent.key values (e.g. '1', 'ArrowRight', 'q').
 * Ignores events when the target is an input/textarea/select.
 */
export function useKeyboard(keyMap: Record<string, () => void>) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't intercept typing in form fields
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      const cb = keyMap[e.key];
      if (cb) {
        e.preventDefault();
        cb();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [keyMap]);
}
