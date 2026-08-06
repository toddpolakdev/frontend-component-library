import type { ReactNode } from 'react';

/**
 * The icon set for the player chrome.
 *
 * Hand-rolled inline SVG rather than an icon package: the library ships no icon
 * dependency (see ThemeToggle), and these are the only glyphs the remote needs.
 * Every icon is 1em square so button font-size drives it, and paints with
 * `currentColor` so the active/disabled key states carry through.
 */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg aria-hidden="true" width="1em" height="1em" viewBox="0 0 24 24" focusable="false">
      {children}
    </svg>
  );
}

export const PlayIcon = () => (
  <Glyph>
    <path d="M8 5.2 19.2 12 8 18.8Z" fill="currentColor" />
  </Glyph>
);

export const PauseIcon = () => (
  <Glyph>
    <path d="M7 5h3.4v14H7zM13.6 5H17v14h-3.4z" fill="currentColor" />
  </Glyph>
);

export const StopIcon = () => (
  <Glyph>
    <rect x="6" y="6" width="12" height="12" rx="1.5" fill="currentColor" />
  </Glyph>
);

export const StepBackwardIcon = () => (
  <Glyph>
    <path d="M18 5.4v13.2L8.4 12zM5 5.4h2.6v13.2H5z" fill="currentColor" />
  </Glyph>
);

export const StepForwardIcon = () => (
  <Glyph>
    <path d="M6 5.4v13.2L15.6 12zM16.4 5.4H19v13.2h-2.6z" fill="currentColor" />
  </Glyph>
);

export const BackwardIcon = () => (
  <Glyph>
    <path d="M11.5 6.4v11.2L4 12zM20 6.4v11.2L12.5 12z" fill="currentColor" />
  </Glyph>
);

export const ForwardIcon = () => (
  <Glyph>
    <path d="M12.5 6.4v11.2L20 12zM4 6.4v11.2L11.5 12z" fill="currentColor" />
  </Glyph>
);

export const ChevronUpIcon = () => (
  <Glyph>
    <path d="M6 15l6-6 6 6" {...stroke} />
  </Glyph>
);

export const ChevronDownIcon = () => (
  <Glyph>
    <path d="M6 9l6 6 6-6" {...stroke} />
  </Glyph>
);

export const ChevronLeftIcon = () => (
  <Glyph>
    <path d="M15 6l-6 6 6 6" {...stroke} />
  </Glyph>
);

export const ChevronRightIcon = () => (
  <Glyph>
    <path d="M9 6l6 6-6 6" {...stroke} />
  </Glyph>
);

export const VolumeUpIcon = () => (
  <Glyph>
    <path d="M3.5 9.2h3.2L11.5 5.2v13.6L6.7 14.8H3.5z" fill="currentColor" />
    <path d="M15.2 9.1a4.4 4.4 0 0 1 0 5.8" {...stroke} />
    <path d="M18.4 6.4a8.2 8.2 0 0 1 0 11.2" {...stroke} />
  </Glyph>
);

export const VolumeMuteIcon = () => (
  <Glyph>
    <path d="M3.5 9.2h3.2L11.5 5.2v13.6L6.7 14.8H3.5z" fill="currentColor" />
    <path d="M15.4 9.6l5 4.8M20.4 9.6l-5 4.8" {...stroke} />
  </Glyph>
);

export const CaptionsIcon = () => (
  <Glyph>
    <rect x="2.6" y="4.6" width="18.8" height="14.8" rx="3" {...stroke} />
    <path d="M10.2 10.4a2.6 2.6 0 1 0 0 3.2M17 10.4a2.6 2.6 0 1 0 0 3.2" {...stroke} />
  </Glyph>
);

export const ExpandIcon = () => (
  <Glyph>
    <path d="M4 9.5V4h5.5M20 9.5V4h-5.5M4 14.5V20h5.5M20 14.5V20h-5.5" {...stroke} />
  </Glyph>
);

export const CompressIcon = () => (
  <Glyph>
    <path d="M9.5 4v5.5H4M14.5 4v5.5H20M9.5 20v-5.5H4M14.5 20v-5.5H20" {...stroke} />
  </Glyph>
);

export const PowerIcon = () => (
  <Glyph>
    <path d="M12 3v8.5" {...stroke} />
    <path d="M7.4 6.6a7.6 7.6 0 1 0 9.2 0" {...stroke} />
  </Glyph>
);

export const ShuffleIcon = () => (
  <Glyph>
    <path d="M3 7h3.6l10 10H21M3 17h3.6l2.8-3M14.6 10.4 17 7.5" {...stroke} />
    <path d="M17.6 4.2 21 7.5l-3.4 3.3M17.6 13.6 21 17l-3.4 3.3" {...stroke} />
  </Glyph>
);

export const LoopIcon = () => (
  <Glyph>
    <path d="M20.4 12a8.4 8.4 0 1 1-2.9-6.4" {...stroke} />
    <path d="M20.6 3.4v4.2h-4.2" {...stroke} />
  </Glyph>
);

export const GripIcon = () => (
  <Glyph>
    <path d="M4 9.5h16M4 14.5h16" {...stroke} />
  </Glyph>
);
