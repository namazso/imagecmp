'use client';

import { useHash } from '@/hooks/useHash';
import { decodeGallery } from '@/lib/codec';
import { CompareView } from '@/components/compare/CompareView';

export default function ComparePage() {
  const [hash] = useHash();

  if (!hash) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-950 text-neutral-400">
        <p>No gallery data in URL. Encode a gallery and add it to the hash.</p>
      </div>
    );
  }

  const gallery = decodeGallery(hash);

  if (!gallery) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-950 text-red-400">
        <p>Invalid or corrupted gallery data.</p>
      </div>
    );
  }

  return <CompareView gallery={gallery} />;
}
