'use client';

import { useState, useRef, useEffect } from 'react';

const SECTIONS = [
  {
    heading: 'Clicker Mode',
    items: [
      'Click a source button to view that image',
      'Click the active source to toggle its checkbox',
      'Unchecked sources are skipped when navigating',
      'Left/Right arrows (←→) cycle through checked sources',
      'Number keys (1\u20139) jump to a source directly',
    ],
  },
  {
    heading: 'Slider Mode',
    items: [
      'Drag the divider to compare two sources',
      'Pick sources A and B from the dropdowns',
      'Number keys (1–9) set source A, letter keys (Q–P) set source B',
      'Set vertical or horizontal orientation in Options',
    ],
  },
  {
    heading: 'Options',
    items: [
      'Scaling — how images are sized (native, fit, or fill)',
      'Alignment — where images anchor when smaller than the canvas',
      'Rendering — interpolation mode (smooth, crisp, or pixelated)',
    ],
  },
  {
    heading: 'General',
    items: [
      'Up/Down arrows (\u2191\u2193) cycle through scenes',
    ],
  },
] as const;

export function HelpTooltip() {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  // Small delay before hiding so the user can move from the button into the tooltip
  const show = () => {
    clearTimeout(timeoutRef.current);
    setVisible(true);
  };
  const hide = () => {
    timeoutRef.current = setTimeout(() => setVisible(false), 150);
  };

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      <button
        type="button"
        aria-label="Help"
        className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-600 text-xs font-bold text-neutral-900 hover:bg-neutral-400"
      >
        ?
      </button>
      {visible && (
        <div className="absolute right-0 top-full z-50 mt-1 w-72 rounded-lg border border-neutral-700 bg-neutral-800 p-4 shadow-lg">
          {SECTIONS.map((section) => (
            <div key={section.heading} className="mb-3 last:mb-0">
              <h3 className="mb-1 text-xs font-semibold text-neutral-300">
                {section.heading}
              </h3>
              <ul className="space-y-0.5 text-xs text-neutral-400">
                {section.items.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
