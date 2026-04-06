import Link from 'next/link';
import { SITE_NAME } from '@/lib/types';

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold tracking-tight text-neutral-100">
          {SITE_NAME}
        </h1>
        <p className="mt-4 text-lg text-neutral-400">
          A tool for side-by-side image comparison. All data is stored in the
          URL — no server, no uploads, no accounts.
        </p>
        <Link
          href="/create"
          className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Create Gallery
        </Link>
      </div>
    </main>
  );
}
