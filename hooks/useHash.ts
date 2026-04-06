'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Reads and writes the URL hash fragment (without the leading '#').
 * Listens for hashchange events to stay in sync.
 * Returns empty string during SSR to avoid hydration mismatch.
 */
export function useHash(): [string, (newHash: string) => void] {
  const [hash, setHashState] = useState('');

  useEffect(() => {
    // Initialize from window after mount
    setHashState(window.location.hash.slice(1));

    const onHashChange = () => {
      setHashState(window.location.hash.slice(1));
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const setHash = useCallback((newHash: string) => {
    window.location.hash = newHash;
    // hashchange doesn't fire when set programmatically in some browsers
    setHashState(newHash);
  }, []);

  return [hash, setHash];
}
