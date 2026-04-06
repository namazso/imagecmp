import Link from 'next/link';
import { SITE_NAME } from '@/lib/types';
import type { Gallery } from '@/lib/types';
import { encodeGallery } from '@/lib/codec';

const EXAMPLE_GALLERY: Gallery = {
  title: 'Big Buck Bunny (2008)',
  sources: ['Q=2', 'Q=10', 'Q=20'],
  scenes: ['Scene 1', 'Scene 2', 'Scene 3', 'Scene 4', 'Scene 5'],
  urls: [
    ['/example/mpv-shot0001__1.jpg', '/example/mpv-shot0001__2.jpg', '/example/mpv-shot0001__3.jpg'],
    ['/example/mpv-shot0002__1.jpg', '/example/mpv-shot0002__2.jpg', '/example/mpv-shot0002__3.jpg'],
    ['/example/mpv-shot0003__1.jpg', '/example/mpv-shot0003__2.jpg', '/example/mpv-shot0003__3.jpg'],
    ['/example/mpv-shot0004__1.jpg', '/example/mpv-shot0004__2.jpg', '/example/mpv-shot0004__3.jpg'],
    ['/example/mpv-shot0005__1.jpg', '/example/mpv-shot0005__2.jpg', '/example/mpv-shot0005__3.jpg'],
  ],
};

const exampleHash = encodeGallery(EXAMPLE_GALLERY);

export default function Home() {
  return (
    <>
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-neutral-100">
            {SITE_NAME}
          </h1>
          <p className="mt-4 text-lg text-neutral-400">
            A tool for side-by-side image comparison. All data is stored in the
            URL — no server, no uploads, no accounts.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/create"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Create Gallery
            </Link>
            <a
              href={`/compare#${exampleHash}`}
              className="inline-block bg-neutral-700 hover:bg-neutral-600 text-neutral-100 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Example Gallery
            </a>
          </div>
        </div>
      </main>
      <footer className="flex items-center justify-between px-6 py-4 text-sm text-neutral-500">
        <span>
          &copy;{' '}
          <a
            href="https://namazso.eu/"
            className="hover:text-neutral-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            namazso
          </a>
        </span>
        <a
          href="https://github.com/namazso/imagecmp"
          className="hover:text-neutral-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
      </footer>
    </>
  );
}
