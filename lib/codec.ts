import { gzipSync, gunzipSync } from 'fflate';
import type { Gallery } from './types';

/**
 * Encode bytes to base64url (RFC 4648 §5).
 * Uses btoa for broad compatibility, then replaces +/ with -_.
 */
function toBase64url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Decode base64url string back to bytes.
 */
function fromBase64url(str: string): Uint8Array {
  // Restore standard base64 characters and padding
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4 !== 0) {
    b64 += '=';
  }
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Encode a Gallery into a base64url-encoded gzip string suitable for a URL hash.
 */
export function encodeGallery(gallery: Gallery): string {
  const json = JSON.stringify(gallery);
  const encoded = new TextEncoder().encode(json);
  const compressed = gzipSync(encoded);
  return toBase64url(compressed);
}

/**
 * Decode a base64url-encoded gzip string back to a Gallery.
 * Returns null if the input is invalid or malformed.
 */
export function decodeGallery(encoded: string): Gallery | null {
  try {
    const compressed = fromBase64url(encoded);
    const decompressed = gunzipSync(compressed);
    const json = new TextDecoder().decode(decompressed);
    const data = JSON.parse(json);

    // Validate shape
    if (
      typeof data !== 'object' ||
      data === null ||
      typeof data.title !== 'string' ||
      !Array.isArray(data.sources) ||
      data.sources.length < 2 ||
      !Array.isArray(data.scenes) ||
      data.scenes.length < 1 ||
      !Array.isArray(data.urls) ||
      data.urls.length !== data.scenes.length
    ) {
      return null;
    }

    for (const row of data.urls) {
      if (!Array.isArray(row) || row.length !== data.sources.length) {
        return null;
      }
    }

    return data as Gallery;
  } catch {
    return null;
  }
}
