import styled from 'styled-components';

/**
 * The zoom surface is a button, so the zoom can be toggled from the keyboard.
 * The source used a `<figure onClick>`, which made the whole feature mouse-only.
 *
 * `touch-action: none` while zoomed stops a drag-to-pan turning into a page
 * scroll — which is what makes one pointer-based implementation serve mouse and
 * touch alike.
 */
export const Frame = styled.button<{ $size: number; $zoomed: boolean }>`
  position: relative;
  display: block;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  max-width: 100%;
  padding: 0;
  overflow: hidden;
  border: 0;
  background-color: var(--app-surface-muted);
  background-repeat: no-repeat;
  cursor: ${({ $zoomed }) => ($zoomed ? 'zoom-out' : 'zoom-in')};
  touch-action: ${({ $zoomed }) => ($zoomed ? 'none' : 'auto')};

  &:focus-visible {
    outline: 2px solid var(--app-primary);
    outline-offset: 2px;
  }
`;

export const Picture = styled.img<{ $hidden: boolean }>`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  /* Hidden rather than removed, so the box keeps its size while zoomed. */
  opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
`;

export const Badge = styled.span<{ $visible: boolean }>`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  padding: 0.35rem;
  border-radius: 6px;
  background: color-mix(in srgb, var(--app-surface) 80%, transparent);
  color: var(--app-text);
  pointer-events: none;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 140ms ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
