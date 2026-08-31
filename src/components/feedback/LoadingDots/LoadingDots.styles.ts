import styled, { keyframes } from 'styled-components';

const blink = keyframes`
  0%   { opacity: 0.2; }
  20%  { opacity: 1; }
  100% { opacity: 0.2; }
`;

export const DotsRoot = styled.span`
  display: inline-flex;
  align-items: center;
  line-height: 1.75rem;
  text-align: center;
`;

/**
 * The staggered delay is the whole effect. In the source the third rule was
 * written `::nth-of-type(3)` — a pseudo-element double colon on what is a
 * pseudo-class — so browsers dropped it and the third dot blinked in lockstep
 * with the first.
 *
 * The visually-hidden label is rendered after the dots, so it never lands on one
 * of these `nth-of-type` positions.
 */
export const Dot = styled.span`
  width: 0.5rem;
  height: 0.5rem;
  margin: 0 2px;
  border-radius: 9999px;
  background-color: currentColor;
  animation: ${blink} 1.4s infinite both;

  &:nth-of-type(2) {
    animation-delay: 0.2s;
  }

  &:nth-of-type(3) {
    animation-delay: 0.4s;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 0.6;
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
