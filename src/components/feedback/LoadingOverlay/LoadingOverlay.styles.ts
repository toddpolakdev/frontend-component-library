import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

/**
 * A translucent veil over content that's mid-update.
 *
 * The source hardcoded `bg-white/40`, which reads as a bright flash on a dark
 * page. `color-mix` tints the app's own background instead, so it follows the
 * theme.
 */
export const Overlay = styled.div<{ $contained: boolean }>`
  position: ${({ $contained }) => ($contained ? 'absolute' : 'fixed')};
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--app-bg) 60%, transparent);
`;

export const Spinner = styled.div`
  width: 3rem;
  height: 3rem;
  border: 4px solid transparent;
  /* The source hardcoded blue-500 regardless of the app's palette. */
  border-top-color: var(--app-primary);
  border-radius: 50%;
  animation: ${spin} 800ms linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation-duration: 2.4s;
  }
`;

export const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
`;
