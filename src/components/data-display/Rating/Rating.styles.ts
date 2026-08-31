import styled from 'styled-components';

/**
 * No vertical padding here on purpose. The source carried `py-6` (1.5rem top and
 * bottom) inside the component, so every consumer inherited a layout decision it
 * couldn't undo without overriding.
 */
export const RatingRoot = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
`;

/**
 * Filled stars take the inherited text colour, so a caller picks the look with
 * plain CSS (`color: goldenrod`) instead of the component hardcoding one.
 */
export const Star = styled.span<{ $filled: boolean }>`
  display: inline-flex;
  color: ${({ $filled }) => ($filled ? 'currentColor' : 'var(--app-border-strong)')};
`;
